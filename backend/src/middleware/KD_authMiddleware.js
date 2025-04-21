const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = {
    verifyAdmin: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.admin = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    },

    // Helper method to generate admin token (for testing)
    generateAdminToken() {
        return jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: '1h' });
    }
};

module.exports = authMiddleware; 