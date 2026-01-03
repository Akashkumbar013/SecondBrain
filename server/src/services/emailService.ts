import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

console.log('📧 Email Service Initialized (Resend)');

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY missing. Skipping email.');
            return;
        }

        const { data, error } = await resend.emails.send({
            from: 'Second Brain <onboarding@resend.dev>', // Default Resend Testing Domain
            to: [email],
            subject: 'Welcome to Second Brain!',
            text: `Hello ${name},\n\nWelcome to Second Brain! We are excited to have you on board.\n\nBest regards,\nThe Second Brain Team`,
        });

        if (error) {
            console.error('Error sending email:', error);
            return;
        }

        console.log('Email sent successfully:', data);
    } catch (error) {
        console.error('Unexpected error sending email:', error);
    }
};

export const sendLoginEmail = async (email: string, name: string) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY missing. Skipping email.');
            return;
        }

        const { data, error } = await resend.emails.send({
            from: 'Second Brain <security@resend.dev>',
            to: [email],
            subject: 'New Login to Second Brain',
            text: `Hello ${name},\n\nYou have just logged into your Second Brain account.\n\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nThe Second Brain Team`,
        });

        if (error) {
            console.error('Error sending login email:', error);
            return;
        }

        console.log('Login email sent successfully:', data);
    } catch (error) {
        console.error('Unexpected error sending login email:', error);
    }
};
