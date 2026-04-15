import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface VerificationCode {
  code: string;
  expiresAt: Date;
  email: string;
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    const response = await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM!,
      subject: 'MedAppoint - Account Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">MedAppoint Account Verification</h2>
          <p>Hello,</p>
          <p>Thank you for registering with MedAppoint. Please enter the following verification code to complete your registration:</p>
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
    });

    console.log('✅ Email sent. Status code:', response[0].statusCode);
    return true;
  } catch (error: any) {
    // This logs the FULL SendGrid error with the exact reason
    console.error('❌ SendGrid error:', error?.response?.body ?? error?.message ?? error);
    return false;
  }
}

export function isValidVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}