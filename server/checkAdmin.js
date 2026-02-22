require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authentic-shop';

async function checkAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Find all admin users
        const admins = await User.find({ role: 'admin' });

        if (admins.length === 0) {
            console.log('❌ No admin users found in database');
        } else {
            console.log(`✅ Found ${admins.length} admin user(s):\n`);
            admins.forEach((admin, index) => {
                console.log(`Admin #${index + 1}:`);
                console.log(`  Name: ${admin.name}`);
                console.log(`  Email: ${admin.email}`);
                console.log(`  Role: ${admin.role}`);
                console.log(`  Created: ${admin.createdAt}`);
                console.log('');
            });
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAdmin();
