import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('----------------------------------------');
console.log('📧 Testing Email Configuration (Resend)...');
console.log('----------------------------------------');

if (!process.env.RESEND_API_KEY) {
    console.error('❌ ERROR: RESEND_API_KEY missing in .env');
    process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const testEmail = async () => {
    try {
        console.log('Attempting to send test email...');
        const { data, error } = await resend.emails.send({
            from: 'Second Brain <onboarding@resend.dev>',
            to: ['recived_test_email@resend.dev'], // Use a safe test email or the user's if known. 
            // Better to use 'delivered@resend.dev' for verification without spamming real inboxes initially or just check API response
            // But usually users want to see it. "delivered@resend.dev" is a magic address that always succeeds.
            subject: 'Second Brain Config Test (Resend)',
            text: 'If you see this, your Resend config is working!',
        });

        if (error) {
            console.error('❌ FAILED:', error);
            return;
        }

        console.log('✅ Test email sent successfully:', data);
    } catch (error: any) {
        console.error('❌ FAILED:', error.message);
    }
};

testEmail();
