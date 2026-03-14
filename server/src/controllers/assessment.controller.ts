import { Request, Response } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getAllAssessments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const assessments = await AssessmentService.getAllAssessments(userId);
  return ApiResponse.success(res, assessments, 'Assessments retrieved successfully');
});

export const getAssessmentById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const assessment = await AssessmentService.getAssessmentById(id);
  return ApiResponse.success(res, assessment, 'Assessment retrieved successfully');
});

export const submitAssessment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const id = req.params.id as string;
  const payload = req.body;
  
  const attempt = await AssessmentService.submitAssessment(userId, id, payload);
  return ApiResponse.success(res, attempt, 'Assessment submitted successfully');
});

export const getAttempts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const attempts = await AssessmentService.getAttempts(userId);
  return ApiResponse.success(res, attempts, 'Assessment attempts retrieved successfully');
});

export const getAttemptById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const id = req.params.id as string; // attempt id
  const attempt = await AssessmentService.getAttemptById(userId, id);
  return ApiResponse.success(res, attempt, 'Assessment attempt retrieved successfully');
});
