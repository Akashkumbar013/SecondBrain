import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import dotenv from 'dotenv';
import { sendWelcomeEmail } from '../services/emailService';

dotenv.config();

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/api/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                let user = await User.findOne({ email: profile.emails![0].value });

                if (user) {
                    // If user exists, return user
                    return done(null, user);
                }

                // If user doesn't exist, create new user
                user = new User({
                    name: profile.displayName,
                    email: profile.emails![0].value,
                    password: 'google-auth-user', // Dummy password for Google users
                    isGoogleUser: true,
                });

                await user.save();

                // Send Welcome Email
                sendWelcomeEmail(user.email, user.name).catch(err => console.error("Google Auth Email failed:", err));

                done(null, user);
            } catch (err) {
                done(err, undefined);
            }
        }
    )
);
