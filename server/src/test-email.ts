import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('----------------------------------------');
console.log('📧 Testing Email Configuration...');
console.log('----------------------------------------');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'MISSING');
console.log('EMAIL_PASS Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'MISSING');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ ERROR: Credentials missing in .env');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const testEmail = async () => {
    try {
        console.log('Attempting to verify connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Second Brain Config Test',
            text: 'If you see this, your email config is working!',
        });
        console.log('✅ Test email sent:', info.response);
    } catch (error: any) {
        console.error('❌ FAILED:', error.message);
        if (error.code === 'EAUTH') {
            console.error('\n👉 SUGGESTION: Invalid App Password.');
            console.error('   1. Go to Google Account > Security > 2-Step Verification (Enable it).');
            console.error('   2. Search "App Passwords".');
            console.error('   3. Generate a new one and paste it into .env');
        }
    }
};

testEmail();
