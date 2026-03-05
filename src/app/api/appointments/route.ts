import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const role = (session!.user as any).role;
  const profileId = (session!.user as any).profileId;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let where: any = {};
  if (role === 'PATIENT') {
    where.patientId = profileId;
  } else if (role === 'DOCTOR') {
    where.doctorId = profileId;
  } else if (role === 'ADMIN') {
    const clinicId = (session!.user as any).clinicId;
    if (clinicId) {
      where.doctor = { clinicId: clinicId };
    }
  }
  if (status) where.status = status;

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      doctor: { include: { clinic: true } },
      patient: true,
      payment: true,
      assessment: true,
    },
    orderBy: { appointmentDate: 'desc' },
  });

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['PATIENT']);
  if (error) return error;

  const patientId = (session!.user as any).profileId;
  const body = await req.json();
  const { doctorId, scheduleId, appointmentDate, appointmentTime, notes, type } = body;

  if (!doctorId || !appointmentDate || !appointmentTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check for conflicting appointment
  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId: parseInt(doctorId),
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { in: ['PENDING', 'APPROVED'] },
    },
  });

  if (conflict) {
    return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      doctorId: parseInt(doctorId),
      patientId,
      scheduleId: scheduleId ? parseInt(scheduleId) : null,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: 'APPROVED',
      notes,
      type: type || 'GENERAL',
    },
    include: { doctor: { include: { clinic: true } }, patient: true, payment: true },
  });

  // DO NOT create payment automatically - patient will pay separately
  return NextResponse.json(appointment, { status: 201 });
}
