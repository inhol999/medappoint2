import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  fullName: z.string().min(2),       // contact person name
  email: z.string().email(),
  phone: z.string().min(10),
  clinicName: z.string().min(2),
  location: z.string().min(2),
  contactNumber: z.string().min(7),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Check username
    const existingUser = await prisma.user.findUnique({ where: { username: data.username } });
    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    // Check email
    const existingEmail = await prisma.patient.findUnique({ where: { email: data.email } });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create the clinic first
    const clinic = await prisma.clinic.create({
      data: {
        clinicName: data.clinicName,
        contactNumber: data.contactNumber,
        location: data.location,
        email: data.email,
        description: data.description,
      },
    });

    // Create a PATIENT user as the clinic owner/contact
    // They can message doctors and manage via the patient portal
    // Admin will see this and can promote to admin if needed
    await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: 'PATIENT',
        patient: {
          create: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.location,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Clinic registered successfully. An admin will review and activate your clinic shortly.',
      clinicId: clinic.clinicId,
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Clinic registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
