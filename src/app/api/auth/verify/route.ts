import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail, generateVerificationCode, isValidVerificationCode } from '@/lib/verification';
import { z } from 'zod';

const sendCodeSchema = z.object({
  email: z.string().email(),
});

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'send') {
      const { email } = sendCodeSchema.parse(body);

      // Check if email is already registered
      const existingPatient = await prisma.patient.findUnique({ where: { email } });
      if (existingPatient) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      // Generate verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Delete any existing codes for this email
      await prisma.verificationCode.deleteMany({ where: { email } });

      // Save verification code
      await prisma.verificationCode.create({
        data: {
          email,
          code,
          expiresAt,
        },
      });

      // Send email
      const emailSent = await sendVerificationEmail(email, code);
      if (!emailSent) {
        return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Verification code sent successfully' });
    }

    if (action === 'verify') {
      const parsed = verifyCodeSchema.parse(body);
      const email = parsed.email;
      const userCode = String(parsed.code).trim();

      if (!isValidVerificationCode(userCode)) {
        return NextResponse.json({ error: 'Invalid verification code format' }, { status: 400 });
      }

      // Find verification code
      const verificationRecord = await prisma.verificationCode.findUnique({
        where: { email },
      });

      if (!verificationRecord) {
        return NextResponse.json({ error: 'No verification code found for this email' }, { status: 400 });
      }

      // Convert both to strings and trim to ensure consistent comparison
      const dbCode = String(verificationRecord.code).trim();
      console.log('[verify] DB code:', dbCode, 'User code:', userCode, 'Match:', dbCode === userCode);

      if (dbCode !== userCode) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
      }

      if (verificationRecord.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
      }

      // Code is valid - return success
      // NOTE: Do NOT delete the code here - let the register endpoint delete it after account creation
      return NextResponse.json({ message: 'Email verified successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}