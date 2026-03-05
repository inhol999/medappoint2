import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

// GET all users (admin only)
export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const userRole = (session!.user as any).role;
  const clinicId = (session!.user as any).clinicId;
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const filterRole = searchParams.get('role');

  // Admins can only list users related to their clinic
  const users = await prisma.user.findMany({
    where: filterRole
      ? {
          AND: [
            filterRole ? { role: filterRole as any } : undefined,
            {
              OR: [
                { admin: { clinicId } },
                { doctor: { clinicId } },
                {
                  patient: {
                    appointments: {
                      some: {
                        doctor: { clinicId },
                      },
                    },
                  },
                },
              ],
            },
          ].filter(Boolean) as any,
        }
      : {
          OR: [
            { admin: { clinicId } },
            { doctor: { clinicId } },
            {
              patient: {
                appointments: {
                  some: {
                    doctor: { clinicId },
                  },
                },
              },
            },
          ],
        },
    include: { admin: true, doctor: { include: { clinic: true } }, patient: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users.map(u => ({
    ...u,
    password: undefined,
  })));
}

const createDoctorSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().min(2),
  specialization: z.string().min(2),
  licenceNumber: z.string().min(3),
  phone: z.string().min(10),
  clinicId: z.number().optional(),
});

// POST create doctor (admin only)
export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const role = (session!.user as any).role;
  const adminClinicId = (session!.user as any).clinicId;
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = createDoctorSchema.parse(body);

    // Admin can only add doctors to their own clinic
    if (!adminClinicId) {
      return NextResponse.json({ error: 'Admin must be assigned to a clinic' }, { status: 400 });
    }

    // Verify admin cannot override clinic assignment
    if (data.clinicId && data.clinicId !== adminClinicId) {
      return NextResponse.json({ error: 'Admin can only add doctors to their own clinic' }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { username: data.username } });
    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const licExisting = await prisma.doctor.findUnique({ where: { licenceNumber: data.licenceNumber } });
    if (licExisting) {
      return NextResponse.json({ error: 'Licence number already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Always assign doctor to admin's clinic
    const assignedClinicId = adminClinicId;

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            fullName: data.fullName,
            specialization: data.specialization,
            licenceNumber: data.licenceNumber,
            phone: data.phone,
            clinicId: assignedClinicId,
          },
        },
      },
      include: { doctor: true },
    });

    return NextResponse.json({ message: 'Doctor created', userId: user.userId }, { status: 201 });
  } catch (err: any) {
    if (err.name === 'ZodError') return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
