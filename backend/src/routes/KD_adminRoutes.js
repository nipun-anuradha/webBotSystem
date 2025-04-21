const express = require('express');
const router = express.Router();
const { adminController, upload } = require('../controllers/KD_adminController');
const authMiddleware = require('../middleware/KD_authMiddleware');

// Authentication routes
router.post('/logout', authMiddleware.verifyAdmin, adminController.logout);
router.post('/refresh-token', adminController.refreshToken);
router.post('/login', adminController.login);

// WhatsApp routes
router.get('/whatsapp-logout', authMiddleware.verifyAdmin, adminController.whatsappLogout);
router.get('/is-connected', authMiddleware.verifyAdmin, adminController.isConnected);
router.get('/generate-qr', authMiddleware.verifyAdmin, adminController.generateQR);

// Items routes
router.post('/items', adminController.getItems);
router.post('/items/add', adminController.addItem);
router.put('/items/update/:id', adminController.updateItem);
router.delete('/items/delete/:id', adminController.deleteItem);

// Image upload routes
router.post('/upload', upload.single('image'), adminController.uploadImage);
router.get('/images', adminController.getImages);
router.delete('/images/:filename', adminController.deleteImage);

module.exports = router;