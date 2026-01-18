/**
 * List all users in the database
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function listAllUsers() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/second-brain';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        const users = await User.find({}).select('name email isVerified isGoogleUser');

        console.log(`Found ${users.length} users:\n`);
        console.log('-----------------------------------');

        users.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Verified: ${user.isVerified ? '✅' : '❌'}`);
            console.log(`   Google User: ${user.isGoogleUser ? '✅' : '❌'}`);
        });

        console.log('\n-----------------------------------');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listAllUsers();
