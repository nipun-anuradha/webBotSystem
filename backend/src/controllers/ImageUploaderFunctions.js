const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure storage
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

// Add these functions to your existing adminController
const imageUploader = {
    // Upload image endpoint handler
    uploadImage: [upload.single('image'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }
            
            // Create relative path for frontend
            const relativePath = `/uploads/${req.file.filename}`;
            
            // Create image record - ideally you would save this in the database
            const newImage = {
                id: uuidv4(),
                name: req.file.originalname,
                path: relativePath,
                uploadDate: new Date().toISOString(),
                size: req.file.size
            };
            
            // You should save this to your database instead of in-memory array
            // For example: await Image.create(newImage);
            
            res.status(201).json({
                success: true,
                message: 'Image uploaded successfully',
                data: newImage
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ success: false, message: 'Error uploading file' });
        }
    }],
    
    // Get all images
    getImages: async (req, res) => {
        try {
            // In a real implementation, you would fetch from database
            // const images = await Image.findAll();
            
            // For example:
            const uploadDir = path.join(__dirname, '../public/uploads');
            let images = [];
            
            if (fs.existsSync(uploadDir)) {
                const files = fs.readdirSync(uploadDir);
                
                images = files.map(file => {
                    const stats = fs.statSync(path.join(uploadDir, file));
                    return {
                        id: file.split('-')[1]?.split('.')[0] || file,
                        name: file,
                        path: `/uploads/${file}`,
                        uploadDate: stats.birthtime,
                        size: stats.size
                    };
                });
            }
            
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
    
    // Delete image
    deleteImage: async (req, res) => {
        try {
            const { id } = req.params;
            
            // In a real implementation, you would delete from database
            // For example: await Image.destroy({ where: { id } });
            
            const uploadDir = path.join(__dirname, '../public/uploads');
            let deleted = false;
            
            if (fs.existsSync(uploadDir)) {
                const files = fs.readdirSync(uploadDir);
                const fileToDelete = files.find(file => file.includes(id));
                
                if (fileToDelete) {
                    fs.unlinkSync(path.join(uploadDir, fileToDelete));
                    deleted = true;
                }
            }
            
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Image not found' });
            }
            
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

module.exports = imageUploader;