import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter, otpLimiter, passwordResetLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/register', authLimiter, authController.registerHandler);
router.post('/login', authLimiter, authController.loginHandler);
router.post('/verify-otp', authController.verifyOTPHandler);
router.post('/resend-otp', otpLimiter, authController.resendOTPHandler);
router.post('/forgot-password', passwordResetLimiter, authController.forgotPasswordHandler);
router.post('/reset-password', authController.resetPasswordHandler);
router.post('/refresh-token', authController.refreshTokenHandler);

// Protected routes
router.post('/logout', authenticate, authController.logoutHandler);
router.get('/me', authenticate, authController.getMeHandler);

export default router;
