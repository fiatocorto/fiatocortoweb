import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createNotification(
  type: string,
  payload: Record<string, any>
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        payload: JSON.stringify(payload),
        seen: false,
      },
    });

    // In production, this would trigger email/webhook
    console.log(`[NOTIFICATION] ${type}:`, payload);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

