import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import * as notificationService from '../services/notification.service';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const data = await notificationService.getNotifications(userId);
  return ApiResponse.success(res, data);
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const id = req.params.id as string;
  if (!userId) return ApiResponse.unauthorized(res);

  await notificationService.markAsRead(userId, id);
  return ApiResponse.success(res, null, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  await notificationService.markAllAsRead(userId);
  return ApiResponse.success(res, null, 'All notifications marked as read');
});
