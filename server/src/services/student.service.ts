import prisma from '../config/database';

export const getDashboardStats = async (userId: string) => {
  const [
    assessmentsCompleted,
    savedCareersCount,
    upcomingSessions,
    profile
  ] = await Promise.all([
    prisma.assessmentAttempt.count({
      where: { userId, completedAt: { not: null } }
    }),
    prisma.savedCareer.count({
      where: { userId }
    }),
    prisma.appointment.count({
      where: {
        studentId: userId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        scheduledAt: { gt: new Date() }
      }
    }),
    prisma.studentProfile.findUnique({
      where: { userId },
      select: { profileCompletion: true }
    })
  ]);

  // For careerMatches, since logic is simple matching without assessment,
  // we could just consider how many recommendations they have.
  // We'll leave it simple for now as requested.
  
  return {
    assessmentsCompleted,
    careerMatches: assessmentsCompleted > 0 ? 5 : 0,
    upcomingSessions,
    profileCompletion: profile?.profileCompletion || 0,
    savedCareersCount,
    totalResourcesViewed: 0 // to be hooked up later
  };
};

export const getRecentActivity = async (userId: string) => {
  const activities = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return activities.map(a => ({
    id: a.id,
    action: a.action,
    entity: a.entity,
    entityId: a.entityId,
    metadata: a.metadata,
    createdAt: a.createdAt,
    description: formatActivityDescription(a)
  }));
};

const formatActivityDescription = (activity: any) => {
  switch (activity.action) {
    case 'VIEWED_CAREER': return `Viewed career details`;
    case 'SAVED_CAREER': return `Saved career to favorites`;
    case 'UPDATED_PROFILE': return `Updated profile information`;
    case 'CHANGED_PASSWORD': return `Changed account password`;
    case 'LOGGED_IN': return `Logged into account`;
    case 'TOOK_ASSESSMENT': return `Completed Assessment`;
    case 'BOOKED_APPOINTMENT': return `Booked a session`;
    default: return `Performed action: ${activity.action.replace(/_/g, ' ').toLowerCase()}`;
  }
};

export const getUpcomingAppointments = async (userId: string) => {
  return prisma.appointment.findMany({
    where: {
      studentId: userId,
      status: { in: ['CONFIRMED', 'PENDING'] },
      scheduledAt: { gt: new Date() }
    },
    orderBy: { scheduledAt: 'asc' },
    take: 3,
    include: {
      counsellor: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          counsellorProfile: {
            select: {
              specializations: true
            }
          }
        }
      }
    }
  });
};
