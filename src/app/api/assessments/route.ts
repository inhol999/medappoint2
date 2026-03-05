import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const appointmentId = searchParams.get('appointmentId');

  const assessment = await prisma.preAssessment.findUnique({
    where: { appointmentId: parseInt(appointmentId!) },
    include: { appointment: { include: { doctor: true, patient: true } } },
  });

  if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(assessment);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['PATIENT']);
  if (error) return error;

  const body = await req.json();
  const { appointmentId, questions, answers, moduleName } = body;

  if (!appointmentId) return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 });

  const assessment = await prisma.preAssessment.upsert({
    where: { appointmentId: parseInt(appointmentId) },
    update: { questions, answers, moduleName },
    create: {
      appointmentId: parseInt(appointmentId),
      questions,
      answers,
      moduleName,
    },
  });

  return NextResponse.json(assessment, { status: 201 });
}
