import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import * as userService from '../services/user.service';
import { logActivity } from '../services/activity.service';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const profile = await userService.getUserProfile(userId);
  if (!profile) return ApiResponse.notFound(res, 'User not found');

  return ApiResponse.success(res, profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const { firstName, lastName, phone, gender, dateOfBirth, ...profileData } = req.body;
  
  const userData: any = {};
  if (firstName !== undefined) userData.firstName = firstName;
  if (lastName !== undefined) userData.lastName = lastName;
  if (phone !== undefined) userData.phone = phone;
  if (gender !== undefined) userData.gender = gender;
  if (dateOfBirth !== undefined) userData.dateOfBirth = new Date(dateOfBirth);

  const updated = await userService.updateUserProfile(userId, userData, profileData);
  
  await logActivity(userId, 'UPDATED_PROFILE');

  return ApiResponse.success(res, updated, 'Profile updated successfully');
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  if (!req.file) {
    return ApiResponse.badRequest(res, 'No file uploaded');
  }

  // Construct URL
  const avatarUrl = `/uploads/${req.file.filename}`;
  
  const updatedUser = await userService.updateAvatar(userId, avatarUrl);
  
  await logActivity(userId, 'UPDATED_PROFILE', 'User', userId, { action: 'avatar_change' });

  return ApiResponse.success(res, updatedUser, 'Avatar updated successfully');
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return ApiResponse.badRequest(res, 'Current and new passwords are required');
  }

  try {
    await userService.changePassword(userId, currentPassword, newPassword);
    await logActivity(userId, 'CHANGED_PASSWORD');
    return ApiResponse.success(res, null, 'Password changed successfully');
  } catch (error: any) {
    return ApiResponse.badRequest(res, error.message);
  }
});
