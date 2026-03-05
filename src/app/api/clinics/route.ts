import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const { error, session } = await requireAuth();
  
  // If user is ADMIN, return only their clinic
  if ((session?.user as any)?.role === 'ADMIN') {
    const clinicId = (session?.user as any)?.clinicId;
    if (!clinicId) {
      return NextResponse.json({ error: 'Admin not associated with a clinic' }, { status: 400 });
    }
    
    const clinic = await prisma.clinic.findUnique({
      where: { clinicId: clinicId },
      include: {
        doctors: {
          where: { availabilityStatus: 'AVAILABLE' },
          select: { doctorId: true, fullName: true, specialization: true },
        },
      },
    });

    return NextResponse.json(clinic ? [clinic] : []);
  }

  // For non-admin users (patients searching), show all active clinics
  const clinics = await prisma.clinic.findMany({
    where: {
      isActive: true,
      OR: search ? [
        { clinicName: { contains: search } },
        { location: { contains: search } },
      ] : undefined,
    },
    include: {
      doctors: {
        where: { availabilityStatus: 'AVAILABLE' },
        select: { doctorId: true, fullName: true, specialization: true },
      },
    },
    orderBy: { clinicName: 'asc' },
  });

  return NextResponse.json(clinics);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['ADMIN']);
  if (error) return error;

  const body = await req.json();
  const { clinicName, contactNumber, location, email, description } = body;

  if (!clinicName || !contactNumber || !location) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const clinic = await prisma.clinic.create({
    data: { clinicName, contactNumber, location, email, description },
  });

  return NextResponse.json(clinic, { status: 201 });
}
