import { Request, Response } from 'express';
import * as careerService from '../services/career.service';
import {
  careerCompareSchema,
  careerQuerySchema,
  saveCareerNoteSchema,
} from '../validators/career.validator';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getCareers = asyncHandler(async (req: Request, res: Response) => {
  const validatedParams = careerQuerySchema.parse(req.query);
  const result = await careerService.getCareers(validatedParams);

  return ApiResponse.success(res, {
    careers: result.careers,
    pagination: result.pagination,
  });
});

export const getCareerById = asyncHandler(async (req: Request, res: Response) => {
  const careerId = String(req.params.id);
  const userId = req.user?.userId;

  const career = await careerService.getCareerById(careerId, userId);

  if (!career) {
    return ApiResponse.notFound(res, 'Career not found');
  }

  return ApiResponse.success(res, { career });
});

export const getRelatedCareers = asyncHandler(async (req: Request, res: Response) => {
  const careerId = String(req.params.id);
  const careers = await careerService.getRelatedCareers(careerId);

  return ApiResponse.success(res, { careers });
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await careerService.getCategories();
  return ApiResponse.success(res, { categories });
});

export const getRecommendedCareers = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return ApiResponse.unauthorized(res);
  }

  const careers = await careerService.getRecommendedCareers(userId);
  return ApiResponse.success(res, careers);
});

export const compareCareers = asyncHandler(async (req: Request, res: Response) => {
  const body = careerCompareSchema.parse(req.body);
  const careers = await careerService.compareCareers(body.careerIds);

  return ApiResponse.success(res, { careers });
});

export const toggleSaveCareer = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const careerId = String(req.params.id);

  if (!userId) {
    return ApiResponse.unauthorized(res);
  }

  const result = await careerService.toggleSaveCareer(userId, careerId);
  return ApiResponse.success(
    res,
    { isSaved: result.isSaved },
    result.isSaved ? 'Career saved' : 'Career removed from saved'
  );
});

export const getSavedCareers = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return ApiResponse.unauthorized(res);
  }

  const savedCareers = await careerService.getSavedCareers(userId);
  return ApiResponse.success(res, { savedCareers });
});

export const updateSavedCareerNote = asyncHandler(async (req: Request, res: Response) => {
  const body = saveCareerNoteSchema.parse(req.body);
  const userId = req.user?.userId;
  const careerId = String(req.params.id);

  if (!userId) {
    return ApiResponse.unauthorized(res);
  }

  const savedCareer = await careerService.updateSavedCareerNote(userId, careerId, body.notes);
  return ApiResponse.success(res, { savedCareer });
});

const careerController = {
  getCareers,
  getCareerById,
  getRelatedCareers,
  getCategories,
  getRecommendedCareers,
  compareCareers,
  toggleSaveCareer,
  getSavedCareers,
  updateSavedCareerNote,
};

export default careerController;
