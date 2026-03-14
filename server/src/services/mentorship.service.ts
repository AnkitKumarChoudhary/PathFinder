import { AppointmentStatus, NotificationType, Prisma } from '@prisma/client';
import prisma from '../config/database';
import {
  AvailabilityInput,
  BookAppointmentInput,
  MentorQueryInput,
  UpdateAppointmentInput,
} from '../validators/mentorship.validator';

type ContractAppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';

type TimeSlot = {
  start: string;
  end: string;
};

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

const mentorLanguagesByEmail: Record<string, string[]> = {
  'dr.meera.nair@pathfinder.in': ['English', 'Hindi', 'Malayalam'],
  'prof.sanjay.gupta@pathfinder.in': ['English', 'Hindi'],
  'ms.kavitha.ram@pathfinder.in': ['English', 'Hindi', 'Tamil', 'Kannada'],
};

const formatTime = (hours: number, minutes = 0): string => {
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
};

const parseTimeToMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const toContractStatus = (status: AppointmentStatus): ContractAppointmentStatus => {
  if (status === 'IN_PROGRESS') return 'RESCHEDULED';
  return status as ContractAppointmentStatus;
};

const toDbStatus = (status: UpdateAppointmentInput['status']): AppointmentStatus | undefined => {
  if (!status) return undefined;
  if (status === 'RESCHEDULED') return 'IN_PROGRESS';
  return status as AppointmentStatus;
};

const getDateRange = (dateString: string): { startOfDay: Date; endOfDay: Date } => {
  const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
  return { startOfDay, endOfDay };
};

const splitCsv = (value?: string): string[] =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeDailySlots = (dayValue: unknown): TimeSlot[] => {
  if (!Array.isArray(dayValue)) return [];

  const objectSlots = dayValue
    .map((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null;
      const candidate = entry as Record<string, unknown>;
      if (typeof candidate.start !== 'string' || typeof candidate.end !== 'string') return null;
      return { start: candidate.start, end: candidate.end };
    })
    .filter((entry): entry is TimeSlot => entry !== null);

  if (objectSlots.length > 0) return objectSlots;

  const stringSlots = dayValue.filter((entry): entry is string => typeof entry === 'string');
  return stringSlots.map((start) => {
    const next = parseTimeToMinutes(start) + 60;
    return {
      start,
      end: formatTime(Math.floor(next / 60), next % 60),
    };
  });
};

const toHourlyChunks = (slots: TimeSlot[]): TimeSlot[] => {
  const chunks: TimeSlot[] = [];
  for (const slot of slots) {
    let current = parseTimeToMinutes(slot.start);
    const end = parseTimeToMinutes(slot.end);
    while (current + 60 <= end) {
      chunks.push({
        start: formatTime(Math.floor(current / 60), current % 60),
        end: formatTime(Math.floor((current + 60) / 60), (current + 60) % 60),
      });
      current += 60;
    }
  }
  return chunks;
};

const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number): boolean => {
  return aStart < bEnd && bStart < aEnd;
};

const formatMentor = (
  profile: {
    id: string;
    specializations: string[];
    qualifications: string[];
    experienceYears: number;
    bio: string | null;
    hourlyRate: number | null;
    rating: number;
    totalSessions: number;
    availableSlots: Prisma.JsonValue | null;
    user: { id: string; firstName: string; lastName: string; email: string; avatar: string | null };
  }
) => ({
  id: profile.user.id,
  profileId: profile.id,
  firstName: profile.user.firstName,
  lastName: profile.user.lastName,
  email: profile.user.email,
  avatar: profile.user.avatar,
  specializations: profile.specializations,
  qualifications: profile.qualifications,
  experience: profile.experienceYears,
  bio: profile.bio,
  hourlyRate: profile.hourlyRate,
  rating: profile.rating,
  totalSessions: profile.totalSessions,
  languages: mentorLanguagesByEmail[profile.user.email] || ['English', 'Hindi'],
  availableSlots: profile.availableSlots,
});

const formatAppointment = (appointment: any) => {
  const scheduledAt = new Date(appointment.scheduledAt);
  const startHours = scheduledAt.getUTCHours();
  const startMinutes = scheduledAt.getUTCMinutes();
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = startTotal + (appointment.duration || 60);

  return {
    ...appointment,
    date: scheduledAt.toISOString().slice(0, 10),
    startTime: formatTime(Math.floor(startTotal / 60), startTotal % 60),
    endTime: formatTime(Math.floor(endTotal / 60), endTotal % 60),
    status: toContractStatus(appointment.status),
  };
};

export const getMentors = async (params: MentorQueryInput) => {
  const { search, specialization, language, minRating, maxRate, experience, page, limit, sort } = params;

  const where: Prisma.CounsellorProfileWhereInput = {
    isVerified: true,
    user: {
      role: 'COUNSELLOR',
    },
  };

  if (search) {
    where.OR = [
      { bio: { contains: search, mode: 'insensitive' } },
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const specializationTerms = splitCsv(specialization);
  if (specializationTerms.length > 0) {
    where.specializations = { hasSome: specializationTerms };
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  if (maxRate !== undefined) {
    where.hourlyRate = { lte: maxRate };
  }

  if (experience === '0-2') where.experienceYears = { lte: 2 };
  if (experience === '3-5') where.experienceYears = { gte: 3, lte: 5 };
  if (experience === '5-10') where.experienceYears = { gte: 5, lte: 10 };
  if (experience === '10+') where.experienceYears = { gt: 10 };

  const orderBy: Prisma.CounsellorProfileOrderByWithRelationInput =
    sort === 'rating_asc'
      ? { rating: 'asc' }
      : sort === 'experience_desc'
        ? { experienceYears: 'desc' }
        : sort === 'experience_asc'
          ? { experienceYears: 'asc' }
          : sort === 'rate_low'
            ? { hourlyRate: 'asc' }
            : sort === 'rate_high'
              ? { hourlyRate: 'desc' }
              : sort === 'sessions_desc'
                ? { totalSessions: 'desc' }
                : sort === 'name_asc'
                  ? { user: { firstName: 'asc' } }
                  : { rating: 'desc' };

  const languageTerms = splitCsv(language).map((item) => item.toLowerCase());

  if (languageTerms.length > 0) {
    const allProfiles = await prisma.counsellorProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
      },
      orderBy,
    });

    const mapped = allProfiles.map(formatMentor);
    const filteredByLanguage = mapped.filter((mentor) => {
      const langSet = new Set(mentor.languages.map((item) => item.toLowerCase()));
      return languageTerms.some((item) => langSet.has(item));
    });

    const total = filteredByLanguage.length;
    const paged = filteredByLanguage.slice((page - 1) * limit, (page - 1) * limit + limit);

    return {
      mentors: paged,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  const [profiles, total] = await Promise.all([
    prisma.counsellorProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.counsellorProfile.count({ where }),
  ]);

  return {
    mentors: profiles.map(formatMentor),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getMentorById = async (mentorId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: mentorId,
      role: 'COUNSELLOR',
    },
    include: {
      counsellorProfile: true,
    },
  });

  if (!user?.counsellorProfile) return null;

  return formatMentor({
    ...user.counsellorProfile,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

export const getMentorAvailability = async (mentorId: string, dateString: string) => {
  const profile = await prisma.counsellorProfile.findUnique({
    where: { userId: mentorId },
    select: {
      availableSlots: true,
    },
  });

  if (!profile) {
    throw new Error('Mentor profile not found');
  }

  const date = new Date(`${dateString}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const dayOfWeek = dayNames[date.getUTCDay()];
  const slotsObject = (profile.availableSlots && typeof profile.availableSlots === 'object'
    ? (profile.availableSlots as Record<string, unknown>)
    : {}) as Record<string, unknown>;

  const daySlots = normalizeDailySlots(slotsObject[dayOfWeek]);

  if (daySlots.length === 0) {
    return {
      date: dateString,
      dayOfWeek,
      availableSlots: [],
      bookedSlots: [],
    };
  }

  const { startOfDay, endOfDay } = getDateRange(dateString);
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      counsellorId: mentorId,
      scheduledAt: { gte: startOfDay, lt: endOfDay },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  const chunks = toHourlyChunks(daySlots);

  const isChunkBooked = (chunk: TimeSlot): boolean => {
    const chunkStart = parseTimeToMinutes(chunk.start);
    const chunkEnd = parseTimeToMinutes(chunk.end);

    return existingAppointments.some((appointment) => {
      const startMinutes = appointment.scheduledAt.getUTCHours() * 60 + appointment.scheduledAt.getUTCMinutes();
      const endMinutes = startMinutes + (appointment.duration || 60);
      return overlaps(startMinutes, endMinutes, chunkStart, chunkEnd);
    });
  };

  const bookedSlots = chunks.filter(isChunkBooked);
  const availableSlots = chunks.filter((chunk) => !isChunkBooked(chunk));

  return {
    date: dateString,
    dayOfWeek,
    availableSlots,
    bookedSlots,
  };
};

export const bookAppointment = async (studentId: string, data: BookAppointmentInput) => {
  const counsellor = await prisma.user.findFirst({
    where: {
      id: data.counsellorId,
      role: 'COUNSELLOR',
    },
    include: {
      counsellorProfile: true,
    },
  });

  if (!counsellor?.counsellorProfile?.isVerified) {
    throw new Error('Counsellor not found or not verified');
  }

  if (studentId === data.counsellorId) {
    throw new Error('Cannot book with yourself');
  }

  const { startOfDay, endOfDay } = getDateRange(data.date);

  const requestedStart = parseTimeToMinutes(data.startTime);
  const requestedEnd = parseTimeToMinutes(data.endTime);

  const [counsellorDayAppointments, studentDayAppointments, student] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        counsellorId: data.counsellorId,
        scheduledAt: { gte: startOfDay, lt: endOfDay },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    }),
    prisma.appointment.findMany({
      where: {
        studentId,
        scheduledAt: { gte: startOfDay, lt: endOfDay },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    }),
    prisma.user.findUnique({
      where: { id: studentId },
      select: { firstName: true, lastName: true },
    }),
  ]);

  const hasCounsellorConflict = counsellorDayAppointments.some((appointment) => {
    const start = appointment.scheduledAt.getUTCHours() * 60 + appointment.scheduledAt.getUTCMinutes();
    const end = start + (appointment.duration || 60);
    return overlaps(start, end, requestedStart, requestedEnd);
  });

  if (hasCounsellorConflict) {
    throw new Error('This time slot is already booked');
  }

  const hasStudentConflict = studentDayAppointments.some((appointment) => {
    const start = appointment.scheduledAt.getUTCHours() * 60 + appointment.scheduledAt.getUTCMinutes();
    const end = start + (appointment.duration || 60);
    return overlaps(start, end, requestedStart, requestedEnd);
  });

  if (hasStudentConflict) {
    throw new Error('You already have an appointment at this time');
  }

  const scheduledAt = new Date(`${data.date}T${data.startTime}:00.000Z`);
  const duration = requestedEnd - requestedStart;

  const appointment = await prisma.appointment.create({
    data: {
      studentId,
      counsellorId: data.counsellorId,
      scheduledAt,
      duration,
      topic: data.type || 'general',
      status: 'PENDING',
    },
    include: {
      counsellor: { select: { firstName: true, lastName: true, email: true, avatar: true } },
      student: { select: { firstName: true, lastName: true, email: true, avatar: true } },
    },
  });

  try {
    await prisma.notification.create({
      data: {
        userId: data.counsellorId,
        type: NotificationType.APPOINTMENT,
        title: 'New Appointment Request',
        message: `${student?.firstName || 'A student'} ${student?.lastName || ''} has requested a session on ${data.date}`,
      },
    });
  } catch {
    // non-blocking
  }

  return formatAppointment({
    ...appointment,
    type: appointment.topic,
  });
};

export const getStudentAppointments = async (studentId: string, status?: string) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      studentId,
      ...(status ? { status: toDbStatus(status as UpdateAppointmentInput['status']) || undefined } : {}),
    },
    include: {
      counsellor: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          counsellorProfile: {
            select: {
              specializations: true,
            },
          },
        },
      },
    },
    orderBy: { scheduledAt: 'desc' },
  });

  return appointments.map((appointment) => formatAppointment({ ...appointment, type: appointment.topic }));
};

export const getCounsellorAppointments = async (counsellorId: string, status?: string) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      counsellorId,
      ...(status ? { status: toDbStatus(status as UpdateAppointmentInput['status']) || undefined } : {}),
    },
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
      counsellor: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: { scheduledAt: 'desc' },
  });

  return appointments.map((appointment) => formatAppointment({ ...appointment, type: appointment.topic }));
};

export const updateAppointment = async (
  appointmentId: string,
  userId: string,
  userRole: string,
  data: UpdateAppointmentInput
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  const existingStatus = toContractStatus(appointment.status);
  const updateData: UpdateAppointmentInput = { ...data };

  if (userRole === 'STUDENT') {
    if (appointment.studentId !== userId) throw new Error('Not authorized');

    if (updateData.status && updateData.status !== 'CANCELLED') {
      throw new Error('Students can only cancel');
    }
    if (updateData.status === 'CANCELLED' && existingStatus !== 'PENDING') {
      throw new Error('Can only cancel pending appointments');
    }
    if ((updateData.rating || updateData.feedback) && existingStatus !== 'COMPLETED') {
      throw new Error('Can only rate completed appointments');
    }

    delete updateData.counsellorNotes;
    delete updateData.meetingLink;
  }

  if (userRole === 'COUNSELLOR') {
    if (appointment.counsellorId !== userId) throw new Error('Not authorized');
    delete updateData.rating;
    delete updateData.feedback;
  }

  if (updateData.status) {
    const validTransitions: Record<ContractAppointmentStatus, ContractAppointmentStatus[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW'],
      COMPLETED: [],
      CANCELLED: [],
      RESCHEDULED: ['CONFIRMED', 'CANCELLED'],
      NO_SHOW: [],
    };

    if (!validTransitions[existingStatus].includes(updateData.status)) {
      throw new Error(`Cannot change status from ${existingStatus} to ${updateData.status}`);
    }
  }

  if (updateData.status === 'CANCELLED' && !updateData.cancelReason) {
    updateData.cancelReason = 'No reason provided';
  }

  const dbStatus = toDbStatus(updateData.status);

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      ...(dbStatus ? { status: dbStatus } : {}),
      ...(updateData.counsellorNotes !== undefined ? { notes: updateData.counsellorNotes } : {}),
      ...(updateData.meetingLink !== undefined ? { meetingLink: updateData.meetingLink } : {}),
      ...(updateData.cancelReason !== undefined ? { cancelReason: updateData.cancelReason } : {}),
      ...(updateData.rating !== undefined ? { rating: updateData.rating } : {}),
      ...(updateData.feedback !== undefined ? { feedback: updateData.feedback } : {}),
    },
    include: {
      counsellor: { select: { firstName: true, lastName: true, email: true, avatar: true } },
      student: { select: { firstName: true, lastName: true, email: true, avatar: true } },
    },
  });

  try {
    const notifyUserId = userId === appointment.studentId ? appointment.counsellorId : appointment.studentId;
    let message = '';
    if (updateData.status === 'CONFIRMED') message = 'Your appointment has been confirmed';
    if (updateData.status === 'CANCELLED') message = 'An appointment has been cancelled';
    if (updateData.status === 'COMPLETED') message = 'Your session has been marked as completed';

    if (message) {
      await prisma.notification.create({
        data: {
          userId: notifyUserId,
          type: NotificationType.APPOINTMENT,
          title: 'Appointment Update',
          message,
        },
      });
    }
  } catch {
    // non-blocking
  }

  return formatAppointment({
    ...updated,
    type: updated.topic,
    counsellorNotes: updated.notes,
  });
};

export const updateAvailability = async (counsellorId: string, slots: AvailabilityInput['slots']) => {
  try {
    return await prisma.counsellorProfile.update({
      where: { userId: counsellorId },
      data: { availableSlots: slots as unknown as Prisma.InputJsonValue },
    });
  } catch {
    throw new Error('Counsellor profile not found');
  }
};
