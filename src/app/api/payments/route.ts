import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const role = (session!.user as any).role;
  const profileId = (session!.user as any).profileId;

  let where: any = {};
  if (role === 'PATIENT') {
    where = { appointment: { patientId: profileId } };
  } else if (role === 'DOCTOR') {
    where = { appointment: { doctorId: profileId } };
  } else if (role === 'ADMIN') {
    const clinicId = (session!.user as any).clinicId;
    if (clinicId) {
      where = { appointment: { doctor: { clinicId: clinicId } } };
    }
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      appointment: {
        include: { doctor: true, patient: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['PATIENT']);
  if (error) return error;

  const body = await req.json();
  const { appointmentId, amount, paymentMethod } = body;

  if (!appointmentId || !amount || !paymentMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existing = await prisma.payment.findUnique({ where: { appointmentId: parseInt(appointmentId) } });
  if (existing) return NextResponse.json({ error: 'Payment already exists' }, { status: 409 });

  // Get the appointment and clinic to verify the amount matches the consultation fee
  const appointment = await prisma.appointment.findUnique({
    where: { appointmentId: parseInt(appointmentId) },
    include: {
      doctor: {
        include: { clinic: true },
      },
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  const clinicFee = appointment.doctor?.clinic?.consultationFee || 500;
  const paymentAmount = parseFloat(amount);

  // Validate that the payment amount matches the clinic's set fee
  if (paymentAmount !== clinicFee) {
    return NextResponse.json(
      { error: `Payment amount must match clinic fee of ₱${clinicFee}` },
      { status: 400 }
    );
  }

  const payment = await prisma.payment.create({
    data: {
      appointmentId: parseInt(appointmentId),
      amount: paymentAmount,
      paymentMethod,
      paymentStatus: 'PAID',
      receipt: `RCP-${Date.now()}`,
    },
  });

  return NextResponse.json(payment, { status: 201 });
}
