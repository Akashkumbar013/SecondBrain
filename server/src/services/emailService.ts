import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('📧 Email Service Initialized');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log('❌ Email Service Connection Error:', error);
    } else {
        console.log('✅ Email Server is ready to take our messages');
    }
});

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials missing. Skipping email.');
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Second Brain!',
            text: `Hello ${name},\n\nWelcome to Second Brain! We are excited to have you on board.\n\nBest regards,\nThe Second Brain Team`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendLoginEmail = async (email: string, name: string) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials missing. Skipping email.');
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'New Login to Second Brain',
            text: `Hello ${name},\n\nYou have just logged into your Second Brain account.\n\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nThe Second Brain Team`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Login email sent: ' + info.response);
    } catch (error: any) {
        if (error.code === 'EAUTH') {
            console.error('❌ Email Authentication Failed: Please check your EMAIL_USER and EMAIL_PASS in .env.');
            console.error('👉 Ensure you are using an "App Password" (generated in Google Account > Security), NOT your regular password.');
        } else {
            console.error('Error sending login email:', error);
        }
    }
};
