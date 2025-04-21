const { Sequelize } = require("sequelize");
const process = require("process");
require('dotenv').config(); // Ensure the .env file is being read

// Create a database connection and connection pool
const sequelize = new Sequelize(
    process.env.USER_DB_NAME, 
    process.env.MAIN_DB_USER, 
    process.env.MAIN_DB_PASSWORD, 
    {
        dialect: 'mysql',
        host: process.env.MAIN_DB_HOST,
        pool: {
            min: parseInt(process.env.DB_POOL_MIN) || 1,
            max: parseInt(process.env.DB_POOL_MAX) || 10
        },
        logging: false, // Enable Sequelize query logging
        timezone: 'Asia/Colombo',  // Set timezone to Sri Lanka
        dialectOptions: {
            timezone: 'local' // Ensure MySQL retrieves timestamps in local time
        },
        sync: {
            force: false,
            alter: false
        }
    }
);

// Test the connection and print success/failure
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
