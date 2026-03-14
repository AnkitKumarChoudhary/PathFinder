import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import * as counsellorService from '../services/counsellor.service';

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const counsellorId = req.user?.userId;
  if (!counsellorId) return ApiResponse.unauthorized(res);

  const stats = await counsellorService.getCounsellorDashboardStats(counsellorId);
  return ApiResponse.success(res, stats, 'Dashboard stats fetched');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const counsellorId = req.user?.userId;
  if (!counsellorId) return ApiResponse.unauthorized(res);

  const profile = await counsellorService.getCounsellorProfile(counsellorId);
  if (!profile) return ApiResponse.notFound(res, 'Profile not found');

  return ApiResponse.success(res, { profile }, 'Profile fetched');
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const counsellorId = req.user?.userId;
  if (!counsellorId) return ApiResponse.unauthorized(res);

  const { bio, specializations, qualifications, languages, hourlyRate } = req.body || {};

  const profile = await counsellorService.updateCounsellorProfile(counsellorId, {
    bio,
    specializations,
    qualifications,
    languages,
    hourlyRate,
  });

  return ApiResponse.success(res, { profile }, 'Profile updated');
});

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const counsellorId = req.user?.userId;
  if (!counsellorId) return ApiResponse.unauthorized(res);

  const students = await counsellorService.getCounsellorStudents(counsellorId);
  return ApiResponse.success(res, { students }, 'Students fetched');
});

export const getAppointmentDetails = asyncHandler(async (req: Request, res: Response) => {
  const counsellorId = req.user?.userId;
  if (!counsellorId) return ApiResponse.unauthorized(res);

  const appointment = await counsellorService.getAppointmentDetails(String(req.params.id), counsellorId);
  return ApiResponse.success(res, { appointment }, 'Appointment details fetched');
});

const counsellorController = {
  getDashboardStats,
  getProfile,
  updateProfile,
  getStudents,
  getAppointmentDetails,
};

export default counsellorController;
