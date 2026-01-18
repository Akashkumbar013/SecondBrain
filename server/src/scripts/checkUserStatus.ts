/**
 * Quick script to check user account status
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function checkUserStatus() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/second-brain';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        const email = 'akash640545@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User not found: ${email}`);
        } else {
            console.log(`✅ User found: ${email}`);
            console.log('-----------------------------------');
            console.log('Name:', user.name);
            console.log('Email:', user.email);
            console.log('Is Verified:', user.isVerified);
            console.log('Is Google User:', user.isGoogleUser);
            console.log('Has Password:', !!user.password);
            console.log('-----------------------------------\n');

            if (!user.isVerified && !user.isGoogleUser) {
                console.log('⚠️  This is a manual account that needs email verification.');
                console.log('Options:');
                console.log('1. Check email for verification link');
                console.log('2. Manually verify (for testing): Update isVerified to true');
            } else if (user.isGoogleUser && !user.isVerified) {
                console.log('⚠️  This Google user is not verified (should be auto-verified)');
                console.log('Fixing: Setting isVerified to true...');
                user.isVerified = true;
                await user.save();
                console.log('✅ Fixed! User is now verified.');
            } else if (user.isVerified) {
                console.log('✅ User is verified and should be able to log in.');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUserStatus();
