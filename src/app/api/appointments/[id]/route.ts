import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await requireAuth();
  if (error) return error;

  const appointment = await prisma.appointment.findUnique({
    where: { appointmentId: parseInt(id) },
    include: {
      doctor: { include: { clinic: true } },
      patient: true,
      payment: true,
      assessment: true,
    },
  });

  if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(appointment);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, session } = await requireAuth(['ADMIN', 'DOCTOR', 'PATIENT']);
  if (error) return error;

  const body = await req.json();
  const role = (session!.user as any).role;

  // Doctors and admins can approve/cancel; patients can cancel or reschedule
  const allowedUpdates: any = {};

  if (body.status) {
    if (role === 'PATIENT' && !['CANCELLED', 'RESCHEDULED'].includes(body.status)) {
      return NextResponse.json({ error: 'Patients can only cancel or reschedule' }, { status: 403 });
    }
    allowedUpdates.status = body.status;
  }
  if (body.appointmentDate) allowedUpdates.appointmentDate = new Date(body.appointmentDate);
  if (body.appointmentTime) allowedUpdates.appointmentTime = body.appointmentTime;
  if (body.notes !== undefined) allowedUpdates.notes = body.notes;

  const updated = await prisma.appointment.update({
    where: { appointmentId: parseInt(id) },
    data: allowedUpdates,
    include: { doctor: true, patient: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, session } = await requireAuth(['PATIENT']);
  if (error) return error;

  const appointmentId = parseInt(id);
  const patientId = (session!.user as any).profileId;

  // Verify the appointment belongs to the patient
  const appointment = await prisma.appointment.findUnique({
    where: { appointmentId },
  });

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  if (appointment.patientId !== patientId) {
    return NextResponse.json({ error: 'You can only delete your own appointments' }, { status: 403 });
  }

  // Only allow deletion of cancelled appointments
  if (appointment.status !== 'CANCELLED') {
    return NextResponse.json({ error: 'Only cancelled appointments can be deleted' }, { status: 400 });
  }

  // Delete the appointment (this will cascade delete related payments, assessments, etc.)
  await prisma.appointment.delete({
    where: { appointmentId },
  });

  return NextResponse.json({ message: 'Appointment deleted successfully' });
}