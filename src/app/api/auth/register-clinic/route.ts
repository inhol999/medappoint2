import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

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

    // Check email against both clinic and admin emails
    const existingClinicEmail = await prisma.clinic.findUnique({ where: { email: data.email } });
    if (existingClinicEmail) {
      return NextResponse.json({ error: 'Email already registered for a clinic' }, { status: 400 });
    }

    const existingAdminEmail = await prisma.admin.findUnique({ where: { email: data.email } });
    if (existingAdminEmail) {
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

    // Create admin user linked to clinic
    try {
      await prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          role: 'ADMIN',
          admin: {
            create: {
              name: data.fullName,
              email: data.email,
              clinicId: clinic.clinicId,
            },
          },
        },
      });
    } catch (error) {
      // If user creation fails, cleanup the clinic
      await prisma.clinic.delete({ where: { clinicId: clinic.clinicId } }).catch(() => {});
      throw error;
    }

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
