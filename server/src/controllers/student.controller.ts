import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import * as studentService from '../services/student.service';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const stats = await studentService.getDashboardStats(userId);
  return ApiResponse.success(res, stats);
});

export const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const activity = await studentService.getRecentActivity(userId);
  return ApiResponse.success(res, activity);
});

export const getUpcomingAppointments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const appointments = await studentService.getUpcomingAppointments(userId);
  return ApiResponse.success(res, appointments);
});
