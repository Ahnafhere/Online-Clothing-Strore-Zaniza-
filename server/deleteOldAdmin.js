require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authentic-shop';

async function deleteOldAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected');

        // Delete the old admin user
        const result = await User.deleteMany({ role: 'admin' });
        console.log(`🗑️ Deleted ${result.deletedCount} admin user(s)`);

        console.log('✅ Old admin deleted successfully!');
        console.log('📝 Restart the server to create new admin with:');
        console.log('   Email: zanizaBD@gmail.com');
        console.log('   Password: Tasneem-11');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

deleteOldAdmin();
