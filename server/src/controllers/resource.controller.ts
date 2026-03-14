import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import * as resourceService from '../services/resource.service';

export const getResources = asyncHandler(async (req: Request, res: Response) => {
  const result = await resourceService.getResources({
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    type: req.query.type as string,
    category: req.query.category as string,
    featured: req.query.featured as string,
  });
  return ApiResponse.success(res, result);
});

export const getFeaturedResources = asyncHandler(async (req: Request, res: Response) => {
  const resources = await resourceService.getFeaturedResources();
  return ApiResponse.success(res, resources);
});

export const getRecommendedResources = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const recommended = await resourceService.getRecommendedResources(userId);
  return ApiResponse.success(res, recommended);
});
