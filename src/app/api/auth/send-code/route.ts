import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail, generateVerificationCode } from '@/lib/verification';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

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
  } catch (error) {
    console.error('❌ Send code error:', {
      message: (error as any)?.message,
      code: (error as any)?.code,
      meta: (error as any)?.meta,
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
