import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth(['ADMIN']);
  if (error) return error;

  const clinicId = (session!.user as any).clinicId;
  if (!clinicId) {
    return NextResponse.json({ error: 'Admin not associated with a clinic' }, { status: 400 });
  }

  const [
    totalPatients,
    totalDoctors,
    totalClinics,
    totalAppointments,
    pendingAppointments,
    todayAppointments,
    totalRevenue,
  ] = await Promise.all([
    prisma.patient.count({
      where: {
        appointments: {
          some: {
            doctor: {
              clinicId: clinicId,
            },
          },
        },
      },
    }),
    prisma.doctor.count({ where: { clinicId: clinicId } }),
    prisma.clinic.count({ where: { clinicId: clinicId, isActive: true } }),
    prisma.appointment.count({
      where: {
        doctor: {
          clinicId: clinicId,
        },
      },
    }),
    prisma.appointment.count({
      where: {
        doctor: {
          clinicId: clinicId,
        },
        status: 'PENDING',
      },
    }),
    prisma.appointment.count({
      where: {
        doctor: {
          clinicId: clinicId,
        },
        appointmentDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    prisma.payment.aggregate({
      where: {
        appointment: {
          doctor: {
            clinicId: clinicId,
          },
        },
        paymentStatus: 'PAID',
      },
      _sum: { amount: true },
    }),
  ]);

  const recentAppointments = await prisma.appointment.findMany({
    where: {
      doctor: {
        clinicId: clinicId,
      },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { doctor: true, patient: true },
  });

  return NextResponse.json({
    totalPatients,
    totalDoctors,
    totalClinics,
    totalAppointments,
    pendingAppointments,
    todayAppointments,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentAppointments,
  });
}
