import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, session } = await requireAuth();
  if (error) return error;

  const userId = parseInt(id);
  const sessionUserId = parseInt((session!.user as any).id);
  const role = (session!.user as any).role;
  const clinicId = (session!.user as any).clinicId;

  // Only allow the user themselves or admins confined to their clinic
  if (sessionUserId !== userId && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { userId },
    include: { admin: true, doctor: { include: { clinic: true } }, patient: { include: { appointments: { include: { doctor: true } } } } },
  });

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (role === 'ADMIN' && sessionUserId !== userId) {
    // Admins can only access users related to their clinic
    const belongsToClinic =
      (user.admin && user.admin.clinicId === clinicId) ||
      (user.doctor && user.doctor.clinicId === clinicId) ||
      (user.patient && user.patient.appointments && user.patient.appointments.some(a => a.doctor && a.doctor.clinicId === clinicId));

    if (!belongsToClinic) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.json({ ...user, password: undefined });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, session } = await requireAuth();
  if (error) return error;

  const userId = parseInt(id);
  const sessionUserId = parseInt((session!.user as any).id);
  const role = (session!.user as any).role;
  const clinicId = (session!.user as any).clinicId;

  // Only allow user themselves or admins scoped to their clinic
  if (role !== 'ADMIN' && sessionUserId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { password, status, ...profileData } = body;

  const updates: any = {};
  if (status && role === 'ADMIN') updates.status = status;
  if (password) updates.password = await bcrypt.hash(password, 12);

  const user = await prisma.user.findUnique({
    where: { userId },
    include: { doctor: { include: { clinic: true } }, patient: { include: { appointments: { include: { doctor: true } } } }, admin: true },
  });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (role === 'ADMIN' && sessionUserId !== userId) {
    const belongsToClinic =
      (user.admin && user.admin.clinicId === clinicId) ||
      (user.doctor && user.doctor.clinicId === clinicId) ||
      (user.patient && user.patient.appointments && user.patient.appointments.some(a => a.doctor && a.doctor.clinicId === clinicId));

    if (!belongsToClinic) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  await prisma.user.update({ where: { userId }, data: updates });

  // Update profile
  if (user.role === 'DOCTOR' && user.doctor && profileData) {
    await prisma.doctor.update({
      where: { doctorId: user.doctor.doctorId },
      data: profileData,
    });
  } else if (user.role === 'PATIENT' && user.patient && profileData) {
    await prisma.patient.update({
      where: { patientId: user.patient.patientId },
      data: profileData,
    });
  }

  return NextResponse.json({ message: 'User updated' });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, session } = await requireAuth();
  if (error) return error;

  const role = (session!.user as any).role;
  const clinicId = (session!.user as any).clinicId;

  const userId = parseInt(id);

  const user = await prisma.user.findUnique({ where: { userId }, include: { admin: true, doctor: true, patient: { include: { appointments: { include: { doctor: true } } } } } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (role === 'ADMIN') {
    const belongsToClinic =
      (user.admin && user.admin.clinicId === clinicId) ||
      (user.doctor && user.doctor.clinicId === clinicId) ||
      (user.patient && user.patient.appointments && user.patient.appointments.some(a => a.doctor && a.doctor.clinicId === clinicId));

    if (!belongsToClinic) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.user.delete({ where: { userId } });

  return NextResponse.json({ message: 'User deleted' });
}
