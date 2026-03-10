import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET all users available for messaging (excluding current user)
export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const currentUserId = parseInt((session!.user as any).id);

  try {
    const users = await prisma.user.findMany({
      where: {
        userId: {
          not: currentUserId, // Exclude current user
        },
      },
      include: {
        admin: true,
        doctor: true,
        patient: true,
      },
      orderBy: { username: 'asc' },
    });

    // Remove passwords and return
    return NextResponse.json(
      users.map(u => ({
        userId: u.userId,
        username: u.username,
        role: u.role,
        admin: u.admin,
        doctor: u.doctor,
        patient: u.patient,
      }))
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
