import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clinic = await prisma.clinic.findUnique({
    where: { clinicId: parseInt(id) },
    include: {
      doctors: {
        include: {
          schedules: { where: { isActive: true } },
        },
      },
    },
  });
  if (!clinic) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(clinic);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error, session } = await requireAuth(['ADMIN']);
  if (error) return error;

  try {
    const body = await req.json();
    const clinicId = parseInt(id);
    const adminClinicId = (session!.user as any).clinicId;

    // Admins can only update their own clinic
    if (adminClinicId !== clinicId) {
      return NextResponse.json({ error: 'Forbidden: You can only update your own clinic' }, { status: 403 });
    }

    // Validate consultationFee if provided
    if (body.consultationFee !== undefined) {
      const fee = parseFloat(body.consultationFee);
      if (isNaN(fee) || fee < 0) {
        return NextResponse.json({ error: 'Invalid consultation fee' }, { status: 400 });
      }
      body.consultationFee = fee;
    }

    const clinic = await prisma.clinic.update({
      where: { clinicId },
      data: body,
    });
    return NextResponse.json(clinic);
  } catch (err: any) {
    console.error('Error updating clinic:', err);
    return NextResponse.json({ error: 'Internal server error: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await requireAuth(['ADMIN']);
  if (error) return error;

  await prisma.clinic.update({
    where: { clinicId: parseInt(id) },
    data: { isActive: false },
  });
  return NextResponse.json({ message: 'Clinic deactivated' });
}
