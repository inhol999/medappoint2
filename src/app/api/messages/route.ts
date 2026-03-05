import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET conversation or all messages
export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const userId = parseInt((session!.user as any).id);
  const { searchParams } = new URL(req.url);
  const withUser = searchParams.get('with');

  if (withUser) {
    // Get conversation with specific user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: parseInt(withUser) },
          { senderId: parseInt(withUser), receiverId: userId },
        ],
      },
      include: {
        sender: { select: { userId: true, username: true, role: true, admin: true, doctor: true, patient: true } },
        receiver: { select: { userId: true, username: true, role: true, admin: true, doctor: true, patient: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark as read
    await prisma.message.updateMany({
      where: { senderId: parseInt(withUser), receiverId: userId, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json(messages);
  }

  // Get all conversations (latest message per user)
  const sent = await prisma.message.findMany({
    where: { senderId: userId },
    distinct: ['receiverId'],
    orderBy: { createdAt: 'desc' },
    include: {
      receiver: { select: { userId: true, username: true, role: true, admin: true, doctor: true, patient: true } },
    },
  });

  const received = await prisma.message.findMany({
    where: { receiverId: userId },
    distinct: ['senderId'],
    orderBy: { createdAt: 'desc' },
    include: {
      sender: { select: { userId: true, username: true, role: true, admin: true, doctor: true, patient: true } },
    },
  });

  // Build unique conversation list
  const conversationMap = new Map<number, any>();
  sent.forEach(m => {
    if (!conversationMap.has(m.receiverId)) {
      conversationMap.set(m.receiverId, { user: m.receiver, lastMessage: m.content, createdAt: m.createdAt, unread: 0 });
    }
  });
  received.forEach(m => {
    if (!conversationMap.has(m.senderId)) {
      conversationMap.set(m.senderId, { user: m.sender, lastMessage: m.content, createdAt: m.createdAt, unread: 0 });
    }
  });

  // Count unread
  const unreadCounts = await prisma.message.groupBy({
    by: ['senderId'],
    where: { receiverId: userId, isRead: false },
    _count: true,
  });
  unreadCounts.forEach(u => {
    if (conversationMap.has(u.senderId)) {
      conversationMap.get(u.senderId).unread = u._count;
    }
  });

  return NextResponse.json(Array.from(conversationMap.values()).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ));
}

// POST send message
export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) return error;

  const senderId = parseInt((session!.user as any).id);
  const body = await req.json();
  const { receiverId, content } = body;

  if (!receiverId || !content?.trim()) {
    return NextResponse.json({ error: 'Missing receiverId or content' }, { status: 400 });
  }

  // Verify receiver exists
  const receiver = await prisma.user.findUnique({ where: { userId: parseInt(receiverId) } });
  if (!receiver) return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId: parseInt(receiverId),
      content: content.trim(),
    },
    include: {
      sender: { select: { userId: true, username: true, role: true } },
      receiver: { select: { userId: true, username: true, role: true } },
    },
  });

  return NextResponse.json(message, { status: 201 });
}
