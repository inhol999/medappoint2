import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const patientRegisterSchema = z.object({
  accountType: z.literal('patient'),
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  verificationCode: z.string().optional(), // Google verification code only required for non-google signup
  googleId: z.string().optional(),
});

const clinicRegisterSchema = z.object({
  accountType: z.literal('clinic'),
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  clinicName: z.string().min(2),
  contactNumber: z.string().min(10),
  location: z.string().min(2),
  email: z.string().email(),
  description: z.string().optional(),
  verificationCode: z.string().optional(),
  googleId: z.string().optional(),
});

const registerSchema = z.union([patientRegisterSchema, clinicRegisterSchema]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const isGoogleSignup = Boolean((data as any).googleId);

    if (!isGoogleSignup) {
      const verificationRecord = await prisma.verificationCode.findUnique({
        where: { email: data.email },
      });

      if (!verificationRecord) {
        return NextResponse.json({ error: 'Email not verified. Please verify your Google account first.' }, { status: 400 });
      }

      // Ensure consistent string comparison
      const verificationCodeToCheck = String(data.verificationCode).trim();
      const dbCode = String(verificationRecord.code).trim();

      if (dbCode !== verificationCodeToCheck) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
      }

      if (verificationRecord.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
      }

      // Delete the verification code after successful verification
      await prisma.verificationCode.delete({ where: { email: data.email } });
    } else {
      if (data.accountType !== 'patient') {
        return NextResponse.json({ error: 'Google signup only supports patient account type.' }, { status: 400 });
      }
    }

    if (data.accountType === 'patient') {
      // Check if username already exists
      const existing = await prisma.user.findUnique({ where: { username: data.username } });
      if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }

      // Check if email already exists for patients
      const emailExists = await prisma.patient.findUnique({ where: { email: data.email } });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);

      const user = await prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: 'PATIENT',
          patient: {
            create: {
              fullName: data.fullName,
              email: data.email,
              phone: data.phone,
              address: data.address,
              dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
              googleId: (data as any).googleId || null,
            },
          },
        },
        include: { patient: true },
      });

      return NextResponse.json({
        message: 'Patient account created successfully',
        userId: user.userId,
      }, { status: 201 });
    } else {
      // Clinic registration - create clinic and admin user
      // Check if username already exists
      const existing = await prisma.user.findUnique({ where: { username: data.username } });
      if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }

      // Check if clinic email already exists
      const emailExists = await prisma.clinic.findUnique({ where: { email: data.email } });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already registered for a clinic' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create clinic
      const clinic = await prisma.clinic.create({
        data: {
          clinicName: data.clinicName,
          contactNumber: data.contactNumber,
          location: data.location,
          email: data.email,
          description: data.description,
          isActive: true, // Auto-activate for now
        },
      });

      // Create admin user for the clinic
      const adminUser = await prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: 'ADMIN',
          admin: {
            create: {
              name: `Admin of ${data.clinicName}`,
              email: data.email,
              clinicId: clinic.clinicId,
            },
          },
        },
        include: { admin: true },
      }).catch(async (err) => {
        // If admin user creation fails, cleanup the clinic
        await prisma.clinic.delete({ where: { clinicId: clinic.clinicId } }).catch(() => {});
        throw err;
      });

      return NextResponse.json({
        message: 'Clinic and admin account created successfully',
        clinicId: clinic.clinicId,
        userId: adminUser.userId,
      }, { status: 201 });
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
