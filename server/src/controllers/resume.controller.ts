import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import * as resumeService from '../services/resume.service';
import { createResumeSchema, updateResumeSchema } from '../validators/resume.validator';

export const createResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const payload = createResumeSchema.parse(req.body);
  const resume = await resumeService.createResume(userId, payload);
  return ApiResponse.created(res, { resume }, 'Resume created successfully');
});

export const getUserResumes = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const resumes = await resumeService.getUserResumes(userId);
  return ApiResponse.success(res, { resumes }, 'Resumes fetched');
});

export const getResumeById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const resume = await resumeService.getResumeById(String(req.params.id), userId);
  return ApiResponse.success(res, { resume }, 'Resume fetched');
});

export const updateResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const updates = updateResumeSchema.parse(req.body);
  const resume = await resumeService.updateResume(String(req.params.id), userId, updates);
  return ApiResponse.success(res, { resume }, 'Resume updated');
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  await resumeService.deleteResume(String(req.params.id), userId);
  return res.status(204).send();
});

export const duplicateResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return ApiResponse.unauthorized(res);

  const resume = await resumeService.duplicateResume(String(req.params.id), userId);
  return ApiResponse.created(res, { resume }, 'Resume duplicated');
});

const resumeController = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
};

export default resumeController;
