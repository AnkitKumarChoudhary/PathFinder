import prisma from '../config/database';

export async function logActivity(
  userId: string,
  action: string,
  entity?: string,
  entityId?: string,
  metadata?: any
) {
  try {
    await prisma.activityLog.create({
      data: { userId, action, entity, entityId, metadata },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
