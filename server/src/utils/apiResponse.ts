import { Response } from 'express';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T = null as T,
    message = 'Success',
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(
    res: Response,
    data: T = null as T,
    message = 'Created successfully'
  ) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message = 'Internal server error',
    statusCode = 500,
    error: unknown = null
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  static forbidden(res: Response, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  static notFound(res: Response, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  static validationError(res: Response, errors: unknown) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  static conflict(res: Response, message = 'Resource already exists') {
    return res.status(409).json({
      success: false,
      message,
    });
  }

  static badRequest(res: Response, message = 'Bad request') {
    return res.status(400).json({
      success: false,
      message,
    });
  }
}
