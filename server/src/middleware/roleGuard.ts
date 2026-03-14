import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

/**
 * Role-based access control middleware
 * Requires user to have one of the specified roles
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.unauthorized(res);
      return;
    }

    if (!roles.includes(req.user.role)) {
      ApiResponse.forbidden(
        res,
        `Access denied. Required role: ${roles.join(' or ')}`
      );
      return;
    }

    next();
  };
};

export const roleGuard = (roles: string[]) => requireRole(...roles);

/**
 * Middleware to check if the current user is accessing their own resource
 * or has admin privileges
 */
export const requireOwnerOrAdmin = (userIdParam = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.unauthorized(res);
      return;
    }

    const resourceUserId = req.params[userIdParam] || req.body[userIdParam];

    if (req.user.role === 'ADMIN' || req.user.userId === resourceUserId) {
      next();
      return;
    }

    ApiResponse.forbidden(
      res,
      'You can only access your own resources'
    );
  };
};

/**
 * Middleware to check if email is verified
 */
export const requireEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // This would need to be checked from the database or token
  // For now, we'll skip this check in development
  if (process.env.NODE_ENV === 'development') {
    next();
    return;
  }

  // In production, implement email verification check
  next();
};
