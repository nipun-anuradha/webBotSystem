const jwt = require('jsonwebtoken');
const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../db/KD_DBConnection');
const Admin = require('../model/KD_AdminModel');
const WhatsAppClientService = require('../service/KD_WhatsAppClient_Service');
const Item = require('../model/KD_ItemModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Image handling functions
const imageUploaderFunctions = {
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            
            // Create relative path for frontend
            const relativePath = `/uploads/${req.file.filename}`;
            
            // Create image record
            const newImage = {
                id: uuidv4(),
                name: req.file.originalname,
                path: relativePath,
                uploadDate: new Date().toISOString(),
                size: req.file.size
            };
            
            // If using database model
            // await Image.create(newImage);
            
            res.status(201).json({
                success: true,
                message: 'Image uploaded successfully',
                data: newImage
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ success: false, message: 'Error uploading file' });
        }
    },
    
    async getImages(req, res) {
        try {
            const uploadDir = path.join(__dirname, '../public/uploads');
    
            // Check if directory exists
            if (!fs.existsSync(uploadDir)) {
                return res.status(200).json({
                    success: true,
                    message: 'No images found',
                    data: []
                });
            }
    
            // Read directory
            const files = fs.readdirSync(uploadDir);
    
            // Map files to image objects
            const images = files.map(file => {
                const stats = fs.statSync(path.join(uploadDir, file));
                return {
                    id: file.split('-')[1]?.split('.')[0] || '',
                    name: file,
                    path: `${req.protocol}://${req.get('host')}/uploads/${file}`, // Corrected path
                    uploadDate: stats.birthtime,
                    size: stats.size
                };
            });
    
            res.status(200).json({
                success: true,
                message: 'Images fetched successfully',
                data: images
            });
        } catch (error) {
            console.error('Error fetching images:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch images' });
        }
    },    
    
    async deleteImage(req, res) {
        try {
            const { filename } = req.params;
            const filePath = path.join(__dirname, '../public/uploads', filename);
            
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found'
                });
            }
            
            // Delete file
            fs.unlinkSync(filePath);
            
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting image:', error);
            res.status(500).json({ success: false, message: 'Failed to delete image' });
        }
    }
};

const adminController = {
    async getItems(req, res) {
        try {
            const { page = 1, limit = 20, keyword = "" } = req.body;
            const offset = (page - 1) * limit;

            const whereCondition = keyword
                ? {
                    [Op.or]: [
                        { service_no: { [Op.like]: `%${keyword}%` } },
                        { name: { [Op.like]: `%${keyword}%` } },
                        { status: { [Op.like]: `${keyword}` } },
                    ],
                }
                : {};
    
            const items = await Item.findAndCountAll({
                where: whereCondition,
                order: [['id', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
            });
    
            res.status(200).json({
                success: true,
                message: "Items fetched successfully!",
                data: items.rows,
                total: items.count,
                currentPage: page,
                totalPages: Math.ceil(items.count / limit),
            });
        } catch (error) {
            console.error("Error fetching items:", error);
            res.status(500).json({ success: false, message: "Failed to fetch items" });
        }
    },
    
    async addItem(req, res) {
        try {
            const { service_no, name, price, status } = req.body;
    
            if (!service_no || !name) {
                return res.status(400).json({ success: false, message: "Required fields missing" });
            }
    
            const existingItem = await Item.findOne({ where: { service_no } });
    
            if (existingItem) {
                return res.status(400).json({ success: false, message: "Item with this service number already exists" });
            }
    
            const newItem = await Item.create({ service_no, name, price, status });
    
            res.status(201).json({
                success: true,
                message: "Item added successfully!",
                data: newItem,
            });
        } catch (error) {
            console.error("Error adding item:", error);
            res.status(500).json({ success: false, message: "Failed to add item" });
        }
    },    

    async updateItem(req, res) {
        try {
            const { id } = req.params;
            const { service_no, name, price, status } = req.body;
    
            const item = await Item.findByPk(id);
    
            if (!item) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }
    
            item.service_no = service_no || item.service_no;
            item.name = name || item.name;
            item.price = price || item.price;
            item.status = status || item.status;
    
            await item.save();
    
            res.status(200).json({
                success: true,
                message: "Item updated successfully!",
                data: item,
            });
        } catch (error) {
            console.error("Error updating item:", error);
            res.status(500).json({ success: false, message: "Failed to update item" });
        }
    },

    async deleteItem(req, res) {
        try {
            const { id } = req.params;
    
            const item = await Item.findByPk(id);
    
            if (!item) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }
    
            await item.destroy();
    
            res.status(200).json({
                success: true,
                message: "Item deleted successfully!",
            });
        } catch (error) {
            console.error("Error deleting item:", error);
            res.status(500).json({ success: false, message: "Failed to delete item" });
        }
    },    
    
    async login(req, res) {
        try {
            const { username, password } = req.body;

            const admin = await Admin.findOne({ where: { username } });
            if (!admin) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, admin.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate tokens
            const accessToken = jwt.sign({ id: admin.id, username }, JWT_SECRET);
            const refreshToken = jwt.sign({ id: admin.id, username }, REFRESH_SECRET, { expiresIn: '7d' });

            // Save refresh token
            admin.refresh_token = refreshToken;
            await admin.save();

            res.json({
                accessToken,
                refreshToken,
                role: admin.role
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token required' });
            }

            const admin = await Admin.findOne({ where: { refresh_token: refreshToken } });
            if (!admin) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }

            jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid refresh token' });
                }

                const accessToken = jwt.sign(
                    { id: admin.id, username: admin.username },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.json({ accessToken });
            });
        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async logout(req, res) {
        try {
            const admin = await Admin.findByPk(req.admin.id);
            admin.refresh_token = null;
            await admin.save();

            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async isConnected(req, res) {
        try {
            let isConnected = await WhatsAppClientService.isConnected();
            res.status(200).json({
                success: true,
                message: 'Whatsapp Client connect status',
                isConnected: isConnected
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to get WhatsApp connection status',
                error: error.message || 'Unknown error'
            });
        }
    },

    async generateQR(req, res) {
        try {
            let code = await WhatsAppClientService.generateQR();
            if (code == null) {
                code = 'https://i.ibb.co/DgCmYP9R/Eclipse-1x-1-0s-200px-200px.gif';
            }
            res.status(200).json({
                success: true,
                message: 'QR code',
                QrCode: code
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to generate QR code',
                error: error.message || 'Unknown error'
            });
        }
    },

    async whatsappLogout(req, res) {
        try {
            let logout = await WhatsAppClientService.whatsappLogout();
            res.status(200).json({
                success: true,
                message: 'Logout status',
                logout: logout
            });
        } catch (error) {
            console.log("error has occurred: " + error);
            res.status(500).json({
                success: false,
                message: 'Logout failed',
                error: error.message || 'Unknown error'
            });
        }
    },

    // Add image uploader endpoints
    uploadImage: imageUploaderFunctions.uploadImage,
    getImages: imageUploaderFunctions.getImages,
    deleteImage: imageUploaderFunctions.deleteImage
};

// Export both the controller and the upload middleware
module.exports = {
    adminController,
    upload
};