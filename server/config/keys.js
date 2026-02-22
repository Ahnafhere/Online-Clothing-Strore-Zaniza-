module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    SESSION_SECRET: process.env.SESSION_SECRET || 'authentic-secret-key',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/authentic-shop'
};
