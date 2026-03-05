import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');

  const schedules = await prisma.schedule.findMany({
    where: {
      doctorId: doctorId ? parseInt(doctorId) : undefined,
      isActive: true,
    },
    include: { doctor: true },
    orderBy: { dayOfWeek: 'asc' },
  });

  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['ADMIN', 'DOCTOR']);
  if (error) return error;

  const body = await req.json();
  const { doctorId, dayOfWeek, startTime, endTime, availabilitySlots } = body;

  if (!doctorId || !dayOfWeek || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const schedule = await prisma.schedule.create({
    data: {
      doctorId: parseInt(doctorId),
      dayOfWeek,
      startTime,
      endTime,
      availabilitySlots: availabilitySlots || 10,
    },
  });

  return NextResponse.json(schedule, { status: 201 });
}
