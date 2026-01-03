import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const data = await resend.emails.send({
      from: 'Akash Kumbar <onboarding@resend.dev>', // Use resend.dev for testing if domain not verified
      to: [email],
      subject: 'Welcome to Second Brain! 🧠',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 20px; border-radius: 10px;">
          <h1 style="color: #fff;">Welcome to Second Brain!</h1>
          <p>Hey ${name},</p>
          <p>My name is Akash Kumbar – I'm the founder and CEO of Second Brain.</p>
          <p>We started Second Brain because we wanted a better way to organize our digital lives. A simple, fast, and elegant interface that <i>just works</i>.</p>
          
          <p>Here are 3 tips to get started:</p>
          <ol>
            <li><a href="#" style="color: #6366f1;">Create your first brain</a></li>
            <li><a href="#" style="color: #6366f1;">Add some content</a></li>
            <li><a href="#" style="color: #6366f1;">Explore other brains</a></li>
          </ol>

          <p><strong>P.S.: Why did you sign up? What brought you here?</strong></p>
          <p>Hit "Reply" and let me know. I read and reply to every email.</p>
          
          <p>Cheers,<br>Akash Kumbar</p>
        </div>
      `,
    });

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to prevent blocking auth flow
    return null;
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  // Note: Ideally this link should go to a frontend page which then calls the API, 
  // OR go to the API which redirects to frontend. 
  // Let's assume API redirect for simplicity: 
  // API URL: http://localhost:5000/api/auth/verify-email?token=...
  const apiUrl = `${process.env.VITE_API_URL || 'https://secondbrain-rm5n.onrender.com/api'}/auth/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: 'Akash Kumbar <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your email for Second Brain',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Verify your email</h2>
          <p>Please click the link below to verify your email address and activate your account:</p>
          <a href="${apiUrl}" style="display: inline-block; background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">Link expires in 24 hours.</p>
        </div>
      `
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}
