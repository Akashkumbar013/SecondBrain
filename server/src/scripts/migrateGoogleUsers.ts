/**
 * Migration Script: Update Existing Google OAuth Users
 * 
 * This script updates existing users who authenticated via Google OAuth:
 * 1. Sets isGoogleUser flag to true for users with dummy password
 * 2. Removes the unhashed dummy password from Google users
 * 
 * Run this script once after deploying the authentication fixes.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function migrateGoogleUsers() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/second-brain';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Find users with the old dummy password
        const googleUsers = await User.find({
            password: 'google-auth-user'
        });

        console.log(`Found ${googleUsers.length} Google OAuth users to migrate`);

        let updated = 0;
        for (const user of googleUsers) {
            // Update user to mark as Google user and remove password
            user.isGoogleUser = true;
            user.password = undefined as any; // Remove password field
            user.isVerified = true; // Ensure Google users are verified
            await user.save();
            updated++;
            console.log(`✅ Updated user: ${user.email}`);
        }

        console.log(`\n✅ Migration complete! Updated ${updated} users.`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run migration
migrateGoogleUsers();
