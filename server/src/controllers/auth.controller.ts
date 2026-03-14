import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result, result.message);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return ApiResponse.conflict(res, error.message);
      }
      if (error.name === 'ZodError') {
        return ApiResponse.validationError(res, (error as any).errors);
      }
      return ApiResponse.badRequest(res, error.message);
    }
    throw error;
  }
});

/**
 * Login with email and password
 * POST /api/auth/login
 */
export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    
    logger.info(`User logged in: ${result.user.email}`);
    
    return ApiResponse.success(res, result, 'Login successful');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid email or password')) {
        return ApiResponse.unauthorized(res, error.message);
      }
      if (error.message.includes('deactivated') || error.message.includes('verify')) {
        return ApiResponse.forbidden(res, error.message);
      }
      return ApiResponse.badRequest(res, error.message);
    }
    throw error;
  }
});

/**
 * Verify OTP for email verification
 * POST /api/auth/verify-otp
 */
export const verifyOTPHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await authService.verifyOTP(req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('expired') || error.message.includes('Invalid')) {
        return ApiResponse.badRequest(res, error.message);
      }
      return ApiResponse.badRequest(res, error.message);
    }
    throw error;
  }
});

/**
 * Resend OTP for email verification
 * POST /api/auth/resend-otp
 */
export const resendOTPHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }
    
    const result = await authService.resendOTP(email);
    return ApiResponse.success(res, null, result.message);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already verified')) {
        return ApiResponse.badRequest(res, error.message);
      }
      return ApiResponse.badRequest(res, error.message);
    }
    throw error;
  }
});

/**
 * Initiate forgot password flow
 * POST /api/auth/forgot-password
 */
export const forgotPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await authService.forgotPassword(req.body);
    return ApiResponse.success(res, null, result.message);
  } catch (error) {
    if (error instanceof Error) {
      // Always return success message to prevent email enumeration
      return ApiResponse.success(res, null, 'If this email exists, a password reset link has been sent.');
    }
    throw error;
  }
});

/**
 * Reset password using token
 * POST /api/auth/reset-password
 */
export const resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await authService.resetPassword(req.body);
    return ApiResponse.success(res, null, result.message);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return ApiResponse.badRequest(res, error.message);
      }
      if (error.name === 'ZodError') {
        return ApiResponse.validationError(res, (error as any).errors);
      }
      return ApiResponse.badRequest(res, error.message);
    }
    throw error;
  }
});

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 */
export const refreshTokenHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await authService.refreshToken(req.body);
    return ApiResponse.success(res, result, 'Token refreshed successfully');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Invalid') || error.message.includes('revoked')) {
        return ApiResponse.unauthorized(res, error.message);
      }
      return ApiResponse.unauthorized(res, 'Unable to refresh token');
    }
    throw error;
  }
});

/**
 * Logout current user
 * POST /api/auth/logout
 */
export const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return ApiResponse.unauthorized(res);
    }
    
    const result = await authService.logout(req.user.userId);
    return ApiResponse.success(res, null, result.message);
  } catch (error) {
    // Even if logout fails, we should clear the client session
    return ApiResponse.success(res, null, 'Logged out successfully');
  }
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMeHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return ApiResponse.unauthorized(res);
    }
    
    const user = await authService.getMe(req.user.userId);
    return ApiResponse.success(res, user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return ApiResponse.notFound(res, error.message);
      }
      return ApiResponse.error(res, error.message);
    }
    throw error;
  }
});
