import nodemailer from 'nodemailer';

export interface VerificationCode {
  code: string;
  expiresAt: Date;
  email: string;
}

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App-specific password for Gmail
  },
});

// Generate a 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'MedAppoint - Google Account Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">MedAppoint Account Verification</h2>
          <p>Hello,</p>
          <p>Thank you for registering with MedAppoint. To complete your account creation, please verify your Google account by entering the following verification code:</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>

          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this verification, please ignore this email.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            MedAppoint - Healthcare, Simplified<br>
            Find your clinic. Book your doctor. Manage your health — all in one place.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

// Verify code format
export function isValidVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}