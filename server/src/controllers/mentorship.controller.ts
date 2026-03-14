import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import * as mentorshipService from '../services/mentorship.service';
import {
  availabilitySchema,
  bookAppointmentSchema,
  mentorQuerySchema,
  updateAppointmentSchema,
} from '../validators/mentorship.validator';

export const getMentors = asyncHandler(async (req: Request, res: Response) => {
  const params = mentorQuerySchema.parse(req.query);
  const result = await mentorshipService.getMentors(params);
  return ApiResponse.success(res, result, 'Mentors fetched');
});

export const getMentorById = asyncHandler(async (req: Request, res: Response) => {
  const mentorId = String(req.params.id);
  const mentor = await mentorshipService.getMentorById(mentorId);
  if (!mentor) return ApiResponse.notFound(res, 'Mentor not found');
  return ApiResponse.success(res, { mentor }, 'Mentor fetched');
});

export const getMentorAvailability = asyncHandler(async (req: Request, res: Response) => {
  const mentorId = String(req.params.id);
  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    return ApiResponse.badRequest(res, 'Date parameter is required (YYYY-MM-DD)');
  }

  const result = await mentorshipService.getMentorAvailability(mentorId, date);
  return ApiResponse.success(res, result, 'Availability fetched');
});

export const bookAppointment = asyncHandler(async (req: Request, res: Response) => {
  const data = bookAppointmentSchema.parse(req.body);
  const studentId = req.user?.userId;
  if (!studentId) return ApiResponse.unauthorized(res);

  const appointment = await mentorshipService.bookAppointment(studentId, data);
  return ApiResponse.created(res, { appointment }, 'Appointment booked successfully');
});

export const getMyAppointments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  if (!userId || !userRole) return ApiResponse.unauthorized(res);

  const status = typeof req.query.status === 'string' ? req.query.status : undefined;

  let appointments: any[] = [];
  if (userRole === 'STUDENT') {
    appointments = await mentorshipService.getStudentAppointments(userId, status);
  } else if (userRole === 'COUNSELLOR') {
    appointments = await mentorshipService.getCounsellorAppointments(userId, status);
  } else {
    appointments = [];
  }

  return ApiResponse.success(res, { appointments }, 'Appointments fetched');
});

export const updateAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointmentId = String(req.params.id);
  const data = updateAppointmentSchema.parse(req.body);
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  if (!userId || !userRole) return ApiResponse.unauthorized(res);

  const appointment = await mentorshipService.updateAppointment(appointmentId, userId, userRole, data);
  return ApiResponse.success(res, { appointment }, 'Appointment updated');
});

export const updateAvailability = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const { slots } = availabilitySchema.parse(req.body);
  const profile = await mentorshipService.updateAvailability(userId, slots);
  return ApiResponse.success(res, { profile }, 'Availability updated');
});

const mentorshipController = {
  getMentors,
  getMentorById,
  getMentorAvailability,
  bookAppointment,
  getMyAppointments,
  updateAppointment,
  updateAvailability,
};

export default mentorshipController;
