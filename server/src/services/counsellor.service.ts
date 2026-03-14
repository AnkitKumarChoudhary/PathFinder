import { AppointmentStatus, Prisma } from '@prisma/client';
import prisma from '../config/database';

const formatTime = (hours: number, minutes = 0): string => {
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
};

const getWeekRange = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  const dayOffsetFromMonday = (now.getDay() + 6) % 7;
  startOfWeek.setDate(now.getDate() - dayOffsetFromMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

const getTodayRange = () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);
  return { startOfToday, startOfTomorrow };
};

const toScheduleSlot = (appointment: {
  id: string;
  scheduledAt: Date;
  duration: number;
  status: AppointmentStatus;
  topic: string | null;
  notes: string | null;
  student: { firstName: string; lastName: string; avatar: string | null; email: string };
}) => {
  const start = new Date(appointment.scheduledAt);
  const startTotal = start.getUTCHours() * 60 + start.getUTCMinutes();
  const endTotal = startTotal + (appointment.duration || 60);

  return {
    id: appointment.id,
    date: start.toISOString().slice(0, 10),
    startTime: formatTime(Math.floor(startTotal / 60), startTotal % 60),
    endTime: formatTime(Math.floor(endTotal / 60), endTotal % 60),
    status: appointment.status,
    type: appointment.topic,
    studentNotes: appointment.notes,
    student: appointment.student,
  };
};

export const getCounsellorDashboardStats = async (counsellorId: string) => {
  const { startOfWeek, endOfWeek } = getWeekRange();
  const { startOfToday, startOfTomorrow } = getTodayRange();

  const [
    totalAppointments,
    pendingCount,
    confirmedCount,
    completedCount,
    uniqueStudentRows,
    averageRatingData,
    thisWeekCount,
    todayAppointmentsRaw,
    recentReviews,
  ] = await prisma.$transaction([
    prisma.appointment.count({ where: { counsellorId } }),
    prisma.appointment.count({ where: { counsellorId, status: 'PENDING' } }),
    prisma.appointment.count({ where: { counsellorId, status: 'CONFIRMED' } }),
    prisma.appointment.count({ where: { counsellorId, status: 'COMPLETED' } }),
    prisma.appointment.findMany({
      where: { counsellorId },
      select: { studentId: true },
      distinct: ['studentId'],
    }),
    prisma.appointment.aggregate({
      where: { counsellorId, rating: { not: null } },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.appointment.count({
      where: {
        counsellorId,
        scheduledAt: { gte: startOfWeek, lte: endOfWeek },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    }),
    prisma.appointment.findMany({
      where: {
        counsellorId,
        scheduledAt: { gte: startOfToday, lt: startOfTomorrow },
        status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    }),
    prisma.appointment.findMany({
      where: { counsellorId, status: 'COMPLETED', rating: { not: null } },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ]);

  return {
    totalAppointments,
    pendingCount,
    confirmedCount,
    completedCount,
    uniqueStudents: uniqueStudentRows.length,
    averageRating: averageRatingData._avg.rating || 0,
    totalRatings: averageRatingData._count.rating,
    thisWeekCount,
    todayAppointments: todayAppointmentsRaw.map(toScheduleSlot),
    recentReviews,
  };
};

export const getCounsellorProfile = async (counsellorId: string) => {
  return prisma.user.findUnique({
    where: { id: counsellorId },
    include: { counsellorProfile: true },
  });
};

type CounsellorProfileUpdates = {
  bio?: string;
  specializations?: string[];
  qualifications?: string[];
  languages?: string[];
  hourlyRate?: number | null;
};

export const updateCounsellorProfile = async (
  counsellorId: string,
  updates: CounsellorProfileUpdates
) => {
  const data: Prisma.CounsellorProfileUpdateInput = {
    ...(updates.bio !== undefined ? { bio: updates.bio } : {}),
    ...(updates.specializations !== undefined ? { specializations: updates.specializations } : {}),
    ...(updates.qualifications !== undefined ? { qualifications: updates.qualifications } : {}),
    ...(updates.hourlyRate !== undefined ? { hourlyRate: updates.hourlyRate } : {}),
  };

  return prisma.counsellorProfile.update({
    where: { userId: counsellorId },
    data,
  });
};

export const getCounsellorStudents = async (counsellorId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: { counsellorId },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          studentProfile: {
            select: {
              stream: true,
              institution: true,
              city: true,
            },
          },
        },
      },
    },
    orderBy: { scheduledAt: 'desc' },
  });

  const grouped = new Map<
    string,
    {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
      studentProfile: {
        stream?: string | null;
        school?: string | null;
        city?: string | null;
      } | null;
      totalSessions: number;
      lastSessionDate: Date;
      lastStatus: AppointmentStatus;
    }
  >();

  appointments.forEach((appointment) => {
    const key = appointment.student.id;
    const current = grouped.get(key);

    if (!current) {
      grouped.set(key, {
        id: appointment.student.id,
        firstName: appointment.student.firstName,
        lastName: appointment.student.lastName,
        email: appointment.student.email,
        avatar: appointment.student.avatar,
        studentProfile: appointment.student.studentProfile
          ? {
              stream: appointment.student.studentProfile.stream,
              school: appointment.student.studentProfile.institution,
              city: appointment.student.studentProfile.city,
            }
          : null,
        totalSessions: 1,
        lastSessionDate: appointment.scheduledAt,
        lastStatus: appointment.status,
      });
      return;
    }

    current.totalSessions += 1;
    if (appointment.scheduledAt > current.lastSessionDate) {
      current.lastSessionDate = appointment.scheduledAt;
      current.lastStatus = appointment.status;
    }
  });

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    lastSessionDate: item.lastSessionDate.toISOString(),
    lastStatus: item.lastStatus,
  }));
};

export const getAppointmentDetails = async (appointmentId: string, counsellorId: string) => {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, counsellorId },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          phone: true,
          studentProfile: true,
        },
      },
    },
  });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  return {
    ...appointment,
    ...toScheduleSlot({
      id: appointment.id,
      scheduledAt: appointment.scheduledAt,
      duration: appointment.duration,
      status: appointment.status,
      topic: appointment.topic,
      notes: appointment.notes,
      student: {
        firstName: appointment.student.firstName,
        lastName: appointment.student.lastName,
        avatar: appointment.student.avatar,
        email: appointment.student.email,
      },
    }),
  };
};
