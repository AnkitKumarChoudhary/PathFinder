import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import * as appointmentService from '../services/appointment.service';

export const getAppointments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) return ApiResponse.unauthorized(res);

  const result = await appointmentService.getAppointments(userId, role, {
    status: req.query.status as string,
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
  });

  return ApiResponse.success(res, result);
});

export const getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) return ApiResponse.unauthorized(res);

  try {
    const appointment = await appointmentService.getAppointmentById(id, userId, role);
    return ApiResponse.success(res, appointment);
  } catch (error: any) {
    // Usually a 403 or 404, we'll return 400 for simplicity of error messages handling here
    return ApiResponse.badRequest(res, error.message);
  }
});

export const cancelAppointment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) return ApiResponse.unauthorized(res);

  const { reason = 'Cancelled by user' } = req.body;
  
  try {
    const updated = await appointmentService.cancelAppointment(id, userId, role, reason);
    return ApiResponse.success(res, updated, 'Appointment cancelled successfully');
  } catch (error: any) {
    return ApiResponse.badRequest(res, error.message);
  }
});

export const submitFeedback = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const { rating, feedback } = req.body;

  try {
    const updated = await appointmentService.submitFeedback(id, userId, rating, feedback);
    return ApiResponse.success(res, updated, 'Feedback submitted successfully');
  } catch (error: any) {
    return ApiResponse.badRequest(res, error.message);
  }
});
