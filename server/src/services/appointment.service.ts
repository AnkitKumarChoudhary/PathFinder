import prisma from '../config/database';
import { AppointmentStatus } from '@prisma/client';

export const getAppointments = async (userId: string, role: string, params: { status?: string, page?: number, limit?: number }) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  
  if (role === 'STUDENT') {
    where.studentId = userId;
  } else if (role === 'COUNSELLOR') {
    where.counsellorId = userId;
  } else {
    throw new Error('Unauthorized role for appointments');
  }

  if (params.status) {
    const statuses = params.status.split(',') as AppointmentStatus[];
    where.status = { in: statuses };
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { scheduledAt: 'desc' },
      include: {
        student: role === 'COUNSELLOR' ? {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        } : false,
        counsellor: role === 'STUDENT' ? {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            avatar: true,
            counsellorProfile: { select: { specializations: true } }
          }
        } : false
      }
    }),
    prisma.appointment.count({ where })
  ]);

  return {
    appointments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getAppointmentById = async (id: string, userId: string, role: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      counsellor: { select: { id: true, firstName: true, lastName: true, avatar: true, counsellorProfile: { select: { specializations: true } } } },
      student: { select: { id: true, firstName: true, lastName: true, avatar: true } }
    }
  });

  if (!appointment) throw new Error('Appointment not found');

  if (role === 'STUDENT' && appointment.studentId !== userId) {
    throw new Error('Unauthorized');
  }
  if (role === 'COUNSELLOR' && appointment.counsellorId !== userId) {
    throw new Error('Unauthorized');
  }

  return appointment;
};

export const cancelAppointment = async (id: string, userId: string, role: string, reason: string) => {
  const appointment = await getAppointmentById(id, userId, role);
  
  if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
    throw new Error('Can only cancel PENDING or CONFIRMED appointments');
  }

  return prisma.appointment.update({
    where: { id },
    data: { 
      status: 'CANCELLED',
      cancelReason: reason 
    }
  });
};

export const submitFeedback = async (id: string, userId: string, rating: number, feedback: string) => {
  const appointment = await getAppointmentById(id, userId, 'STUDENT');
  
  if (appointment.status !== 'COMPLETED') {
    throw new Error('Can only review COMPLETED appointments');
  }

  return prisma.appointment.update({
    where: { id },
    data: {
      rating,
      feedback
    }
  });
};
