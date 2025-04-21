const { Client, LocalAuth, MessageAck, MessageMedia } = require("whatsapp-web.js");
const Service = require("../model/KD_ServiceModel");
const sequelize = require('../db/KD_DBConnection');
const Sender = require("../model/KD_SenderModel");
const Item = require("../model/KD_ItemModel");
const { Sequelize } = require('sequelize');
const qrcode = require("qrcode-terminal");
const qrcodeurl = require("qrcode");
const { Op } = require('sequelize');
const amqp = require("amqplib");
const path = require('path');
const fs = require('fs');
const { create } = require("domain");
require('dotenv').config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const QUEUE_NAME = "whatsapp_messages_z";
let processingMessage = false;
const TIMEOUT_MINUTES = 5;
let storeQrCode;

let retries = 0;
const maxRetries = 3;
const pendingReplies = new Map();

let WhatsAppClient = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one",
    dataPath: "./.wwebjs_auth",
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-software-rasterizer",
    ],
    defaultViewport: null,
    timeout: 60000,
    ignoreHTTPSErrors: true,
  },
  restartOnAuthFail: true,
  qrMaxRetries: 5,
  authTimeoutMs: 60000,
  takeoverOnConflict: true,
  takeoverTimeoutMs: 60000,
});

async function isConnected() {
  try {
    if (WhatsAppClient.info === undefined || WhatsAppClient.info === null) {
      console.log('Client is not connected.');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking connection status:', error);
    return false;
  }
}

async function generateQR() {
  try {
    if (storeQrCode) {
      // Generate QR code as a base64 image
      const qrImage = await qrcodeurl.toDataURL(storeQrCode);
      console.log('qrImage generated for send by api');
      return qrImage;
    } else {
      console.log('no qr code');
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}

async function whatsappLogout() {
  try {
    if (WhatsAppClient.info) {
      await WhatsAppClient.logout();
      console.log('WhatsApp client logged out successfully.');
      await WhatsAppClient.destroy();
      console.log('WhatsApp client destroyed.');

      await new Promise(resolve => setTimeout(resolve, 3000));

      const sessionPath = path.join(__dirname, '../../.wwebjs_auth');
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log('Session data deleted.');
      }


      storeQrCode = null;
      await initializeClient();
      // whatsappOn();
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
}

const initializeClient = async () => {
  try {

    if (WhatsAppClient.info) {
      await WhatsAppClient.destroy();
      console.log("Destroyed existing client instance");
    }

    WhatsAppClient = new Client({
      authStrategy: new LocalAuth({
        clientId: "client-one",
        dataPath: "./.wwebjs_auth",
      }),
      puppeteer: {
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
          "--disable-extensions",
          "--disable-software-rasterizer",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding"
        ],
        defaultViewport: null,
        timeout: 60000,
        ignoreHTTPSErrors: true,
      },
      restartOnAuthFail: true,
      qrMaxRetries: 5,
      authTimeoutMs: 60000,
      takeoverOnConflict: true,
      takeoverTimeoutMs: 60000,
    });

    whatsappOn();

    console.log("Initializing WhatsApp client...");
    await WhatsAppClient.initialize();
  } catch (error) {
    console.error("Initialization error:", error);
    if (retries < maxRetries) {
      retries++;
      console.log(`Retrying initialization (${retries}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await initializeClient();
    } else {
      console.error(
        "Max retries reached. Could not initialize WhatsApp client."
      );
      process.exit(1);
    }
  }
};

async function sendMessageToQueue(message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log("Message sent to queue..");

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const whatsappOn = () => {

  try {
    WhatsAppClient.on("qr", (qr) => {
      try {
        console.log("QR Code received. Scan this QR code in WhatsApp to log in:");
        storeQrCode = qr;
        // qrcode.generate(qr, { small: true });
      } catch (error) {
        console.error("Error generating QR code:", error.message);
      }
    });

    WhatsAppClient.on("ready", async () => {
      console.log("WhatsApp client is ready and connected!");
      retries = 0;
      await startConsumer();
    });

    WhatsAppClient.on("message", async (msg) => {
      if (processingMessage) return;
      processingMessage = true;

      try {
        const userPhone = msg.from.split("@")[0];

        const [userData, created] = await Sender.findOrCreate({
          where: { tell: userPhone },
          defaults: {
            name: 'null',
            selected_language: 'null',
            last_replymsg_title: 'null',
            last_replymsg_status: 'null',
            last_answered_service: 'null',
            last_answered_location: 'null',
            last_answered_method: 'null',
            last_answered_date: 'null'
          }
        });

        console.log(created ? "New user created" : "User already exists");

        userData.timeout_reactive_status = true;
        await userData.save();

        const userMSGBody = msg.body.trim();

        setTimeout(() => {
          console.log("This code runs after 0.5 seconds.");
        }, 500); // delay


        function isSessionTimedOut(lastUpdateTime) {
          if (!lastUpdateTime) return false;

          const lastUpdate = new Date(lastUpdateTime);
          const now = new Date();
          const diffInMinutes = (now - lastUpdate) / (1000 * 60);

          return diffInMinutes > TIMEOUT_MINUTES;
        }
        if (isSessionTimedOut(userData.updatedAt)) {
          typing(msg, async (chat) => {
            userData.last_replymsg_title = "null";
            userData.last_replymsg_status = "null";
            userData.timeout_reactive_status = false;
            await userData.save();
            let message;
            if (userData.selected_language == "sinhala" || userData.selected_language == null) {
              message = `⏰ කාල සීමාව ඉක්මවා ගොස් ඇත!\n\nඔබේ අක්‍රියතාව හේතුවෙන් සැසිය කල් ඉකුත් වී ඇත. \n\n*📢[ ප්‍රධාන මෙනුවට යාමට කොටු සලකුණ (#) ඇතුළත් කරන්න. ]*`
            } else if (userData.selected_language == "english") {
              message = `⏰ The time limit has been exceeded!\n\nThe session has timed out due to your inactivity. \n\n*📢[ Enter (Reply) the hash sign (#) to return to the main menu. ]*`
            }
            await WhatsAppClient.sendMessage(msg.from, message);
          });
          return
        }
        async function typing(msg, callback) {
          const chat = await msg.getChat();
          chat.sendStateTyping();

          try {
            await callback(chat);
          } finally {
            chat.clearState();
          }
        }
        async function saveUserData(user) {
          await user.save();
        }
        async function getItemDetails(serviceNo) {
          try {
            const item = await Item.findOne({ where: { service_no: serviceNo } });
            return item;
          } catch (error) {
            console.log('Error', error);
            throw error;
          }
        }
        async function getServices(user) {
          try {
            if (user.selected_language == 'sinhala') {
              const services = await Service.findAll({ attributes: ['service_name_sinhala'] });
              const serviceNames = services.map(service => service.service_name_sinhala);
              return serviceNames;
            }
            if (user.selected_language == 'english') {
              const services = await Service.findAll({ attributes: ['service_name_english'] });
              const serviceNames = services.map(service => service.service_name_english);
              return serviceNames;
            }
          } catch (error) {
            console.log('Error', error);
            throw error;
          }
        }
        function getNumberWithEmoji(index) {
          const emojiNumbers = [
            "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"
          ];

          if (index >= 10) {
            const digits = index.toString().split('');
            return digits.map(digit => emojiNumbers[parseInt(digit)]).join('');
          }

          return emojiNumbers[index];
        }
        async function saveWbotStudent(user) {
          const {
            tell: mobile,
            name,
            selected_language: medium,
            last_answered_method: method,
            last_answered_service,
            last_answered_location,
          } = user;

          try {
            // Fetch service_id based on selected_language
            let service;
            if (last_answered_service) {
              const serviceColumn = medium === 'sinhala' ? 'service_name_sinhala' : 'service_name_english';
              service = await Service.findOne({
                where: {
                  [serviceColumn]: last_answered_service,
                },
              });
            }

            // Fetch location_id based on last_answered_location
            let location = null;
            if (last_answered_location) {
              const locationColumn = medium === 'sinhala' ? 'place_time_sinhala' : 'place_time_english';
              location = await Location.findOne({
                where: {
                  [locationColumn]: last_answered_location,
                },
              });
            }

            // Find or create the student
            const [student, created] = await WStudents.findOrCreate({
              where: { mobile },
              defaults: {
                mobile,
                name,
                medium,
                method,
                service_id: service ? service.id : null,
                location_id: location ? location.id : null,
              },
            });

            // If the student already exists, update all fields
            if (!created) {
              await student.update({
                name,
                medium,
                method,
                service_id: service ? service.id : null,
                location_id: location ? location.id : null,
              });
            }

            try {
              const locationText = location && location.place_time_english && location.place_time_english !== 'null'
                ? ' At ' + location.place_time_english
                : '';

              const groupLinkText = method === 'physical' && location && location.group_link
                ? ' GroupLink: ' + location.group_link
                : '';

              if (created) {
                await sendSingleMessage(
                  `${name}, You have joined new class. Mobile: ${mobile}, Subject: ${service ? service.service_name_english : 'Unknown'}${locationText}${groupLinkText}`,
                  mobile,
                  'create'
                );
                await sendTeacherSMS(
                  `New student joined. Name: ${name}, Mobile: ${mobile}, Subject: ${service ? service.service_name_english : 'Unknown'}${locationText}.`
                );
              } else {
                await sendSingleMessage(
                  `${name}, You have changed your class. Mobile: ${mobile}, Subject: ${service ? service.service_name_english : 'Unknown'}${locationText}${groupLinkText}`,
                  mobile,
                  'update'
                );
              }
            } catch (smsError) {
              console.error("Error while sending SMS:", smsError);
            }

            console.log(created ? 'Student created successfully!' : 'Student updated successfully!');
          } catch (error) {
            console.error('Error saving/updating student:', error);
          }
        }


        async function erroHandle() {
          if (userMSGBody === "*") {
            if (userData.last_replymsg_title === "language") {

              typing(msg, async (chat) => {

                let message = `*⚡සුබ දවසක් !⚡*\n\n*ඔබව zentex electricals මගින් තොරතුරු සපයන ඩිජිටල් ස්වංක්‍රිය සේවා සහාය සඳහා ඔබව සාදරයෙන් පිළිගනිමු!*\n\n*➤ තොරතුරු ලබා ගැනීමට ඔබට අවශ්‍ය භාෂාව තෝරන්න:*\n\n*1️⃣ සිංහල* \n\n*2️⃣ English* \n\n💡# zentex expert service ! \n\n_❓[ඉදිරියට යාමට තෝරා ගැනීමට අදාල ඉදිරියෙන් ඇති අංකය ඇතුළත් කරන්න (Reply).]_`;

                userData.last_replymsg_status = "active";
                const messageData = {
                  from: msg.from,
                  body: message,
                }
                pendingReplies.set(msg.from, true);
                await sendMessageToQueue(messageData);
                await saveUserData(userData);
              });

            }
            else if (userData.last_replymsg_title === "service") {

              typing(msg, async (chat) => {
                let message;
                if (userData.selected_language == "sinhala") {
                  message = `*➤ ඉදිරියට යාම සදහා ඔබගේ නම ඇතුලත් කරන්න :*\n\n_[ ප්‍රධාන මෙනුවට යාමට කොටු සලකුණ (#) ඇතුළත් කරන්න (Reply). ]_`;
                } else if (userData.selected_language == "english") {
                  message = `*➤ Enter your name to continue :*\n\n_[ Enter (Reply) the hash sign (#) to return to the main menu. ]_`;
                }
                const messageData = {
                  from: msg.from,
                  body: message,
                }
                userData.last_replymsg_status = "active";
                pendingReplies.set(msg.from, true);
                await sendMessageToQueue(messageData);
                await saveUserData(userData);

              });
            }
            else if (userData.last_replymsg_title === "method") {
              let message;
              if (userData.selected_language == 'sinhala') {
                message = `*${userData.name},*\n\n*➤ මේ අතරින් ඔබගේ අවශ්‍යතාවයට අදාළ අංකය ඇතුළත් කරන්න:*\n\n`
                const services = await getServices(userData);
                services.forEach((item, index) => {
                  message += `*${getNumberWithEmoji([index + 1])} ${item}*\n\n`;
                });
              }
              if (userData.selected_language == 'english') {
                message = `*${userData.name},*\n\n*➤ Please enter the number relevant to your requirement:*\n\n`;
                const services = await getServices(userData);
                services.forEach((item, index) => {
                  message += `*${getNumberWithEmoji([index + 1])} ${item}*\n\n`;
                });
              }
              message += `💡# zentex expert service !\n\n_❓[ To proceed, Enter the number (Reply) in front of the selection. Enter the asterisk (*) to change the language (Reply). ]_`;

            }
            else if (userData.last_replymsg_title === "details") {

              typing(msg, async (chat) => {
                const itemDetails = await getItemDetails(userMSGBody);
                let message;
                if (userData.selected_language == 'sinhala') {
                  if (itemDetails) {
                    message += `සේවා අංකය: ${itemDetails.service_no}\nඋපකරණය: ${itemDetails.name}\n\n`;
                    if (itemDetails.status == 'pending') {
                      message += `*තවම නඩත්තු කිරීම ආරම්බ කර නැත. නැවත පසුව පරීක්ෂා කරන්න.*\n\n`;
                    } else if (itemDetails.status == 'ongoing') {
                      message += `*ඔබගේ උපකරණය නඩත්තු කරමින් පවතී.*\n\n`;
                    } else if (itemDetails.status == 'done') {
                      message += `ඔබගේ උපකරණය නඩත්තු කර අවසන්. හැකි ඉක්මනින් රැගෙන යාමට කාරුණික වන්න.\nමුදල : ${itemDetails.price}\n\n`;
                    } else if (itemDetails.status == 'fail') {
                      message += `ඔබගේ උපකරණය නඩත්තු කිරීමට නොහැක. ඉක්මනින් රැගෙන යාමට කාරුණික වන්න\n\n`;
                    }
                  } else {
                    message += `*ඔබ ඇතුලත් කරන ලද සේවා අංකයට අදාල උපකරණ පද්දතියට ඇතුලත් කර නොමැත.*\n🔅 ඔබගේ සේවා අංකය නැවත පරික්ෂා කරන්න.\n🔅 දින කිහිපයකින් උත්සහ කරන්න.\n\n`;
                  }
                  message += `_[ ප්‍රධාන මෙනුවට යාමට කොටු සලකුණ (#) ඇතුළත් කරන්න (Reply). ]_`;

                } else if (userData.selected_language == 'english') {

                  if (itemDetails) {
                    message += `Service No: ${itemDetails.service_no}\nEquipment: ${itemDetails.name}\n\n`;
                    if (itemDetails.status == 'pending') {
                      message += `*Maintenance has not started yet. Please check back later.*\n\n`;
                    } else if (itemDetails.status == 'ongoing') {
                      message += `*Your item is undergoing maintenance..*\n\n`;
                    } else if (itemDetails.status == 'done') {
                      message += `Your item has been serviced. Please pick it up as soon as possible.\Service charge : ${itemDetails.price}\n\n`;
                    } else if (itemDetails.status == 'fail') {
                      message += `Your item is not serviceable. Please pick it up as soon as possible\n\n`;
                    }
                  } else {
                    message += `*The device corresponding to the service number you entered is not included in the system..*\n🔅 Please recheck your service number..\n🔅 Try in a few days.\n\n`;
                  }
                  message += `_[ Enter the hash sign (#) to go to the main menu. (Reply). ]_`;
                }


                userData.last_replymsg_title = "final";
                userData.last_replymsg_status = "active";
                const messageData = {
                  from: msg.from,
                  body: message,
                }
                pendingReplies.set(msg.from, true);
                await sendMessageToQueue(messageData);
                await saveUserData(userData);
              });

            }
            else {
              if (pendingReplies.has(msg.from)) {
                console.log(`User ${msg.from} sent another message while waiting.`);
                let message;
                if (userData.selected_language == "sinhala") {
                  message = `⏳ මදක් රැඳී සිටින්න,\nඔබගේ පෙර ඉල්ලීම තවමත් සකසමින් පවතී !\n`;
                } else if (userData.selected_language == "english") {
                  message = `⏳ Please wait...,\nYour previous request is still being processed !\n`;
                }
                await WhatsAppClient.sendMessage(msg.from, message);
                return;

              } else {
                let message;
                if (userData.selected_language == "sinhala") {
                  message = `🔅 ඔබගේ ඇතුළත් කිරීම වැරදියි. 🔅 \n_📢[ කරුණාකර පෙර මෙනුවට යාමට තරු සලකුණ (*) ද ප්‍රධාන මෙනුවට යාමට කොටු සලකුණ (#) ද ඇතුළත් (Reply) කරන්න. ]_`;
                } else if (userData.selected_language == "english") {
                  message = `🔅 Your entry is incorrect. 🔅 \n_📢[ Please Enter an asterisk (*) to go back to the previous menu and a hash mark (#) to go to the main menu (Reply). ]_`;
                }

                const messageData = {
                  from: msg.from,
                  body: message,
                }

                pendingReplies.set(msg.from, true);
                await sendMessageToQueue(messageData);
                userData.last_replymsg_status = "null";
                await saveUserData(userData);
              }
            }
          }
          else if (userMSGBody === "#") {
            typing(msg, async (chat) => {

              let message = `*⚡සුබ දවසක් !⚡*\n\n*ඔබව zentex electricals මගින් තොරතුරු සපයන ඩිජිටල් ස්වංක්‍රිය සේවා සහාය සඳහා ඔබව සාදරයෙන් පිළිගනිමු!*\n\n*➤ තොරතුරු ලබා ගැනීමට ඔබට අවශ්‍ය භාෂාව තෝරන්න:*\n\n*1️⃣ සිංහල* \n\n*2️⃣ English* \n\n💡# zentex expert service ! \n\n_❓[ඉදිරියට යාමට තෝරා ගැනීමට අදාල ඉදිරියෙන් ඇති අංකය ඇතුළත් කරන්න (Reply).]_`;

              userData.last_replymsg_title = "language";
              userData.last_replymsg_status = "active";
              const messageData = {
                from: msg.from,
                body: message,
              }
              pendingReplies.set(msg.from, true);
              await sendMessageToQueue(messageData);
              await saveUserData(userData);
            });

          }
          else {

            if (pendingReplies.has(msg.from)) {
              console.log(`User ${msg.from} sent another message while waiting.`);
              let message;
              if (userData.selected_language == "sinhala") {
                message = `⏳ මදක් රැඳී සිටින්න,\nඔබගේ පෙර ඉල්ලීම තවමත් සකසමින් පවතී !\n`;
              } else if (userData.selected_language == "english") {
                message = `⏳ Please wait...,\nYour previous request is still being processed !\n`;
              }
              await WhatsAppClient.sendMessage(msg.from, message);
              return;

            } else {

              let message;
              if (userData.selected_language == "sinhala") {
                message = `🔅 ඔබගේ ඇතුළත් කිරීම වැරදියි. 🔅 \n_📢[ කරුණාකර පෙර මෙනුවට යාමට තරු සලකුණ (*) ද ප්‍රධාන මෙනුවට යාමට කොටු සලකුණ (#) ද ඇතුළත් (Reply) කරන්න. ]_`;
              } else if (userData.selected_language == "english") {
                message = `🔅 Your entry is incorrect. 🔅 \n_📢[ Please Enter an asterisk (*) to go back to the previous menu and a hash mark (#) to go to the main menu (Reply). ]_`;
              }
              const messageData = {
                from: msg.from,
                body: message,
              }
              pendingReplies.set(msg.from, true);
              await sendMessageToQueue(messageData);
              userData.last_replymsg_status = "null";
              await saveUserData(userData);

            }
          }
        }


        if (userData.last_replymsg_title === "null") {
          typing(msg, async (chat) => {

            let message = `*⚡සුබ දවසක් !⚡*\n\n*ඔබව zentex electricals මගින් තොරතුරු සපයන ඩිජිටල් ස්වංක්‍රිය සේවා සහාය සඳහා ඔබව සාදරයෙන් පිළිගනිමු!*\n\n*➤ තොරතුරු ලබා ගැනීමට ඔබට අවශ්‍ය භාෂාව තෝරන්න:*\n\n*1️⃣ සිංහල* \n\n*2️⃣ English* \n\n💡# zentex expert service ! \n\n_❓[ඉදිරියට යාමට තෝරා ගැනීමට අදාල ඉදිරියෙන් ඇති අංකය ඇතුළත් කරන්න (Reply).]_`;

            userData.last_replymsg_title = "language";
            userData.last_replymsg_status = "active";
            const messageData = {
              from: msg.from,
              body: message,
            }
            pendingReplies.set(msg.from, true);
            await sendMessageToQueue(messageData);
            await saveUserData(userData);

            setTimeout(() => {
              console.log("This code runs after 2 seconds.");
            }, 2000); // delay

          });

        }
        else if (userData.last_replymsg_status === "active" && userData.last_replymsg_title === "language") {


          if (userMSGBody == '1') {
            typing(msg, async (chat) => {

              let message = `*➤ ඉදිරියට යාම සදහා ඔබගේ නම ඇතුලත් කරන්න :*\n\n_[ ප්‍රධාන මෙනුවට යාමට කොටු සලකුණ (#) ඇතුළත් කරන්න (Reply). ]_`;
              const messageData = {
                from: msg.from,
                body: message,
              }
              userData.last_replymsg_title = "service";
              userData.last_replymsg_status = "active";
              userData.selected_language = 'sinhala';
              pendingReplies.set(msg.from, true);
              await sendMessageToQueue(messageData);
              await saveUserData(userData);

            });
          } else if (userMSGBody == '2') {
            typing(msg, async (chat) => {

              let message = `*➤ Enter your name to continue :*\n\n_[ Enter (Reply) the hash sign (#) to return to the main menu. ]_`;
              const messageData = {
                from: msg.from,
                body: message,
              }
              userData.last_replymsg_title = "service";
              userData.last_replymsg_status = "active";
              userData.selected_language = 'english';
              pendingReplies.set(msg.from, true);
              await sendMessageToQueue(messageData);
              await saveUserData(userData);

            });
          } else {
            await erroHandle();
          }

        }
        else if (userData.last_replymsg_status === "active" && userData.last_replymsg_title === "service") {

          let message;

          if (userMSGBody !== "#" && userMSGBody !== "*") {
            userData.name = userMSGBody;
            typing(msg, async (chat) => {
              if (userData.selected_language == 'sinhala') {
                message = `*${userData.name},*\n\n*➤ මේ අතරින් ඔබගේ අවශ්‍යතාවයට අදාළ අංකය ඇතුළත් කරන්න:*\n\n`
                const services = await getServices(userData);
                services.forEach((item, index) => {
                  message += `*${getNumberWithEmoji([index + 1])} ${item}*\n\n`;
                });
              }
              if (userData.selected_language == 'english') {
                message = `*${userData.name},*\n\n*➤ Please enter the number relevant to your requirement:*\n\n`;
                const services = await getServices(userData);
                services.forEach((item, index) => {
                  message += `*${getNumberWithEmoji([index + 1])} ${item}*\n\n`;
                });
              }
              message += `💡# zentex expert service !\n\n_❓[ To proceed, Enter the number (Reply) in front of the selection. Enter the asterisk (*) to go to previous. (Reply). ]_`;

              userData.last_replymsg_title = "method";
              userData.last_replymsg_status = "active";
              const messageData = {
                from: msg.from,
                body: message,
              }
              pendingReplies.set(msg.from, true);
              await sendMessageToQueue(messageData);
              await saveUserData(userData);
            });
          } else {
            erroHandle();
          }

        }
        else if (userData.last_replymsg_status === "active" && userData.last_replymsg_title === "method") {

          if (userMSGBody >= 1 && userMSGBody <= 1) {

            let message;
            const service = await getServices(userData);
            userData.last_answered_service = service[userMSGBody - 1];

            if (userData.selected_language == 'sinhala') {
              message = `*ඔබ ${userData.last_answered_service} අවශ්‍ය බව තෝරා ගෙන ඇත.*\n\n➤ *නඩත්තු කිරීමට ලබා දී ඇති උපකරණයේ සේවා අංකය ඇතුලත් කරන්න.:*\n\n💡#Zentex expert services !\n\n❓[ පෙර මෙනුව ට යාමට තරු සලකුණ ද (*), ප්‍රධාන මෙනුව ට යාමට කොටු සලකුණ ද (#) ඇතුළත් කරන්න(Reply). ]`;
            } else if (userData.selected_language == 'english') {
              message = `*You have selected to get ${userData.last_answered_service}.*\n\n➤ *Please enter service number of your equipment:*\n\n💡# zentex expert service !\n\n❓[ Enter (Reply) the hash sign (#) to return to the main menu. ]`;
            }

            typing(msg, async (chat) => {
              userData.last_replymsg_title = "details";
              userData.last_replymsg_status = "active";
              const messageData = {
                from: msg.from,
                body: message,
              }
              pendingReplies.set(msg.from, true);
              await sendMessageToQueue(messageData);
              await saveUserData(userData);
            });

          } else if (userMSGBody == 2) {

            let message;

            if (userData.selected_language == 'sinhala') {
              message = `*ඔබ තාක්ෂණික ශිල්පියා සම්බන්ද කරගැනීම තෝරාගෙන ඇත.*\n\n*පහත අංකය වෙත දුරකථන ඇමතුමක් ලබාදෙන්න*\n*📞 0740799239*`;
            } else if (userData.selected_language == 'english') {
              message = `*You have selected to contact the technician.*\n\n*Please make a call to this following number*\n*📞 0740799239*`;
            }

            typing(msg, async (chat) => {
              userData.last_replymsg_title = "final";
              userData.last_replymsg_status = "active";
              const messageData = {
                from: msg.from,
                body: message,
              }
              pendingReplies.set(msg.from, true);
              await sendMessageToQueue(messageData);
              await saveUserData(userData);
            });

          } else if (userMSGBody == 3) {

            typing(msg, async (chat) => {
              userData.last_replymsg_title = "final";
              userData.last_replymsg_status = "active";
              await saveUserData(userData);

              const uploadsDir = path.join(__dirname, '../public/uploads');

              fs.readdir(uploadsDir, async (err, files) => {
                if (err) {
                  console.error('Error reading directory:', err);
                  return;
                }

                // Filter only image files (jpg, jpeg, png, gif)
                const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));

                if (imageFiles.length === 0) {
                  console.log('No images found in uploads directory.');
                  return;
                }

                // Get the first 10 images
                const first10Images = imageFiles.slice(0, 10);

                for (const file of first10Images) {
                  const filePath = path.join(uploadsDir, file);
                  const media = MessageMedia.fromFilePath(filePath);
                  await WhatsAppClient.sendMessage(msg.from, media);
                  console.log(`Sent image: ${file}`);
                }
              });
            });

          } else {
            await erroHandle();
          }
        }
        else if (userData.last_replymsg_status === "active" && userData.last_replymsg_title === "details") {

          typing(msg, async (chat) => {
            const itemDetails = await getItemDetails(userMSGBody);
            let message;

            if (userData.selected_language == 'sinhala') {
              if (itemDetails) {
                message = `සේවා අංකය: ${itemDetails.service_no}\nඋපකරණය: ${itemDetails.name}\n\n`;
                if (itemDetails.status == 'pending') {
                  message += `*තවම නඩත්තු කිරීම ආරම්බ කර නැත. නැවත පසුව පරීක්ෂා කරන්න.*\n\n`;
                } else if (itemDetails.status == 'ongoing') {
                  message += `*ඔබගේ උපකරණය නඩත්තු කරමින් පවතී.*\n\n`;
                } else if (itemDetails.status == 'done') {
                  message += `ඔබගේ උපකරණය නඩත්තු කර අවසන්. හැකි ඉක්මනින් රැගෙන යාමට කාරුණික වන්න.\nමුදල : ${itemDetails.price}\n\n`;
                } else if (itemDetails.status == 'fail') {
                  message += `ඔබගේ උපකරණය නඩත්තු කිරීමට නොහැක. ඉක්මනින් රැගෙන යාමට කාරුණික වන්න\n\n`;
                }
              } else {
                message = `*ඔබ ඇතුලත් කරන ලද සේවා අංකයට අදාල උපකරණ පද්දතියට ඇතුලත් කර නොමැත.*\n🔅 ඔබගේ සේවා අංකය නැවත පරික්ෂා කරන්න.\n🔅 දින කිහිපයකින් උත්සහ කරන්න.\n\n`;
              }
              message += `_[ ප්‍රධාන මෙනුවට යාමට කොටු සලකුණ (#) ඇතුළත් කරන්න (Reply). ]_`;

            } else if (userData.selected_language == 'english') {

              if (itemDetails) {
                message = `Service No: ${itemDetails.service_no}\nEquipment: ${itemDetails.name}\n\n`;
                if (itemDetails.status == 'pending') {
                  message += `*Maintenance has not started yet. Please check back later.*\n\n`;
                } else if (itemDetails.status == 'ongoing') {
                  message += `*Your item is undergoing maintenance..*\n\n`;
                } else if (itemDetails.status == 'done') {
                  message += `Your item has been serviced. Please pick it up as soon as possible.\Service charge : ${itemDetails.price}\n\n`;
                } else if (itemDetails.status == 'fail') {
                  message += `Your item is not serviceable. Please pick it up as soon as possible\n\n`;
                }
              } else {
                message = `*The device corresponding to the service number you entered is not included in the system.*\n🔅 Please recheck your service number..\n🔅 Try in a few days.\n\n`;
              }
              message += `_[ Enter the hash sign (#) to go to the main menu. (Reply). ]_`;
            }

            userData.last_replymsg_title = "final";
            userData.last_replymsg_status = "active";
            const messageData = {
              from: msg.from,
              body: message,
            }
            pendingReplies.set(msg.from, true);
            await sendMessageToQueue(messageData);
            await saveUserData(userData);
          });

        }
        else {
          await erroHandle();
        }

      } catch (err) {
        console.error("Error processing message:", err);
        let message = `🔅සමාවන්න. මෙම ස්වංක්‍රීය පද්ධතියේ යම් දෝෂයක් මතුව ඇත.🔅 \n_📢[ කරුණාකර මද වේලාවකින් පසු නැවත උත්සහ කරන්න. ]_`;
        const messageData = {
          from: msg.from,
          body: message,
        }

        await sendMessageToQueue(messageData);
      } finally {
        processingMessage = false;
      }
    });

    WhatsAppClient.on("disconnected", async (reason) => {
      console.log("WhatsApp client was disconnected:", reason);

      try {

        await new Promise(resolve => setTimeout(resolve, 3000));

        const sessionPath = path.join(__dirname, '../../.wwebjs_auth');
        if (fs.existsSync(sessionPath)) {
          fs.rmSync(sessionPath, { recursive: true, force: true });
          console.log('Session data deleted.');
        }


        storeQrCode = null;
        await initializeClient();
        // whatsappOn();

      } catch (error) {
        console.log(error);
      }
    });

    WhatsAppClient.on("authenticated", () => {
      console.log("WhatsApp client authenticated successfully!");
    });

    WhatsAppClient.on("auth_failure", (msg) => {
      console.error("WhatsApp authentication failed:", msg);
    });
  } catch (error) {
    console.log(error);
  }

}
whatsappOn();

async function markReplyCompleted(customer) {
  pendingReplies.delete(customer);
}

async function connectWithRetry(url, retries = 10, delay = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await amqp.connect(url);
      console.log("Connected to RabbitMQ");
      return connection;
    } catch (error) {
      console.warn(`RabbitMQ connection failed (attempt ${attempt}/${retries}). Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Failed to connect to RabbitMQ after multiple retries.");
}

async function startConsumer() {
  try {
    const connection = await connectWithRetry(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log("Waiting for messages...");

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          try {
            const message = JSON.parse(msg.content.toString());
            console.log("Processing message..");

            const chat = await WhatsAppClient.getChatById(message.from);
            await chat.sendStateTyping();

            setTimeout(async () => {
              await WhatsAppClient.sendMessage(message.from, message.body);
              console.log("Reply sent..");

              await chat.clearState();
              markReplyCompleted(message.from);

              channel.ack(msg);
            }, 0);
          } catch (err) {
            console.error("Error processing message:", err);
            // Optionally don't ack message if failed
          }
        }
      },
      { noAck: false }
    );

    // Handle unexpected connection closure
    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
    });

    connection.on("close", () => {
      console.warn("RabbitMQ connection closed. Reconnecting...");
      setTimeout(startConsumer, 5000); // Restart consumer on disconnect
    });

  } catch (error) {
    console.error("Error in consumer setup:", error);
    setTimeout(startConsumer, 5000); // Retry after failure
  }
}


module.exports = {
  client: WhatsAppClient,
  initialize: initializeClient,
  isConnected: isConnected,
  generateQR: generateQR,
  whatsappLogout: whatsappLogout,
};
