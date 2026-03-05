import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clinicId = searchParams.get('clinicId');
  const specialization = searchParams.get('specialization');
  const search = searchParams.get('search');

  const doctors = await prisma.doctor.findMany({
    where: {
      clinicId: clinicId ? parseInt(clinicId) : undefined,
      specialization: specialization ? { contains: specialization } : undefined,
      OR: search ? [
        { fullName: { contains: search } },
        { specialization: { contains: search } },
      ] : undefined,
      user: { status: 'ACTIVE' },
    },
    include: {
      clinic: true,
      schedules: { where: { isActive: true } },
      user: { select: { status: true } },
    },
    orderBy: { fullName: 'asc' },
  });

  return NextResponse.json(doctors);
}
