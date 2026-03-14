import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Rate limiter for authentication endpoints
 * More strict to prevent brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: isDev ? 1 * 60 * 1000 : 15 * 60 * 1000,
  max: isDev ? 100 : 10,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for OTP resend
 * Very strict to prevent spam
 */
export const otpLimiter = rateLimit({
  windowMs: isDev ? 1 * 60 * 1000 : 60 * 1000,
  max: isDev ? 30 : 1,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: isDev ? 1 * 60 * 1000 : 15 * 60 * 1000,
  max: isDev ? 500 : 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for password reset
 * Strict to prevent abuse
 */
export const passwordResetLimiter = rateLimit({
  windowMs: isDev ? 1 * 60 * 1000 : 60 * 60 * 1000,
  max: isDev ? 30 : 3,
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
