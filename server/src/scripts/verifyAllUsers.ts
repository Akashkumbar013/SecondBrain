/**
 * Verify specific user accounts manually
 * Use this for testing or when email verification is not working
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function verifyUsers() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/second-brain';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Verify all manual (non-Google) users for testing purposes
        const result = await User.updateMany(
            { isGoogleUser: { $ne: true } },
            { $set: { isVerified: true } }
        );

        console.log(`✅ Verified ${result.modifiedCount} manual registration users`);
        console.log('\nAll users can now log in with their email and password! 🎉\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyUsers();
