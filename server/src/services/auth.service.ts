import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../config/database';
import { redis } from '../config/redis';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/generateToken';
import { generateOTP, generateResetToken } from '../utils/generateOTP';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { Role, Gender, EducationLevel, Stream } from '@prisma/client';

// =================== VALIDATION SCHEMAS ===================

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  dateOfBirth: z.string().optional(),
  role: z.nativeEnum(Role).default(Role.STUDENT),
  // Student profile fields
  educationLevel: z.nativeEnum(EducationLevel).optional(),
  stream: z.nativeEnum(Stream).optional(),
  board: z.string().optional(),
  institution: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  interests: z.array(z.string()).optional(),
  // Counsellor profile fields
  qualifications: z.array(z.string()).optional(),
  experienceYears: z.number().optional(),
  specializations: z.array(z.string()).optional(),
  organization: z.string().optional(),
  bio: z.string().optional(),
  // Parent profile fields
  childEmail: z.string().email().optional(),
  occupation: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyOTPSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// =================== TYPES ===================

type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;
type VerifyOTPData = z.infer<typeof verifyOTPSchema>;
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
type RefreshTokenData = z.infer<typeof refreshTokenSchema>;

// =================== SERVICE CLASS ===================

class AuthService {
  private readonly OTP_EXPIRY = 600; // 10 minutes in seconds
  private readonly REFRESH_TOKEN_EXPIRY = 604800; // 7 days in seconds
  private readonly RESET_TOKEN_EXPIRY = 3600; // 1 hour in seconds
  private readonly SALT_ROUNDS = 12;

  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    // Validate input
    const validated = registerSchema.parse(data);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, this.SALT_ROUNDS);

    // Create user with profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          email: validated.email,
          passwordHash,
          firstName: validated.firstName,
          lastName: validated.lastName,
          phone: validated.phone,
          gender: validated.gender,
          dateOfBirth: validated.dateOfBirth ? new Date(validated.dateOfBirth) : null,
          role: validated.role,
        },
      });

      // Create corresponding profile based on role
      if (validated.role === Role.STUDENT) {
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            educationLevel: validated.educationLevel,
            stream: validated.stream,
            board: validated.board,
            institution: validated.institution,
            city: validated.city,
            state: validated.state,
            interests: validated.interests || [],
          },
        });
      } else if (validated.role === Role.COUNSELLOR || validated.role === Role.MENTOR) {
        await tx.counsellorProfile.create({
          data: {
            userId: newUser.id,
            qualifications: validated.qualifications || [],
            experienceYears: validated.experienceYears || 0,
            specializations: validated.specializations || [],
            organization: validated.organization,
            bio: validated.bio,
          },
        });
      } else if (validated.role === Role.PARENT) {
        // Look up child by email if provided
        let childrenIds: string[] = [];
        if (validated.childEmail) {
          const child = await tx.user.findUnique({
            where: { email: validated.childEmail },
            select: { id: true, role: true },
          });
          if (child && child.role === Role.STUDENT) {
            childrenIds = [child.id];
          }
        }

        await tx.parentProfile.create({
          data: {
            userId: newUser.id,
            childrenIds,
            occupation: validated.occupation,
          },
        });
      }

      return newUser;
    });

    // Generate and store OTP
    const otp = generateOTP();
    await redis.setex(`otp:${validated.email}`, this.OTP_EXPIRY, otp);

    // Log OTP in development (would send email in production)
    if (env.NODE_ENV === 'development') {
      logger.info(`📧 OTP for ${validated.email}: ${otp}`);
    } else {
      // TODO: Send email with OTP
      // await this.sendVerificationEmail(validated.email, otp);
      logger.info(`📧 OTP sent to ${validated.email}`);
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user as typeof user & { passwordHash: string };
    return {
      user: userWithoutPassword,
      message: 'Registration successful. Please check your email for the verification code.',
    };
  }

  /**
   * Login with email and password
   */
  async login(data: LoginData) {
    // Validate input
    const validated = loginSchema.parse(data);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: {
        studentProfile: true,
        counsellorProfile: true,
        parentProfile: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.passwordHash) {
      throw new Error('Please login using the method you signed up with (e.g., Google)');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validated.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    // Warn if email not verified (but allow login in development)
    if (!user.isEmailVerified && env.NODE_ENV === 'production') {
      throw new Error('Please verify your email before logging in');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    // Store refresh token in Redis
    await redis.setex(
      `refresh:${user.id}`,
      this.REFRESH_TOKEN_EXPIRY,
      refreshToken
    );

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify OTP for email verification
   */
  async verifyOTP(data: VerifyOTPData) {
    const validated = verifyOTPSchema.parse(data);

    // Get stored OTP from Redis
    const storedOTP = await redis.get(`otp:${validated.email}`);

    if (!storedOTP) {
      throw new Error('OTP has expired. Please request a new one.');
    }

    if (storedOTP !== validated.otp) {
      throw new Error('Invalid OTP. Please try again.');
    }

    // Update user's email verification status
    const user = await prisma.user.update({
      where: { email: validated.email },
      data: { isEmailVerified: true },
    });

    // Delete OTP from Redis
    await redis.del(`otp:${validated.email}`);

    logger.info(`✅ Email verified for ${validated.email}`);

    return {
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  /**
   * Resend OTP for email verification
   */
  async resendOTP(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If this email exists, a verification code has been sent.' };
    }

    if (user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    // Generate new OTP
    const otp = generateOTP();
    await redis.setex(`otp:${email}`, this.OTP_EXPIRY, otp);

    // Log OTP in development
    if (env.NODE_ENV === 'development') {
      logger.info(`📧 New OTP for ${email}: ${otp}`);
    } else {
      // TODO: Send email with OTP
      logger.info(`📧 OTP resent to ${email}`);
    }

    return { message: 'Verification code sent to your email' };
  }

  /**
   * Initiate forgot password flow
   */
  async forgotPassword(data: ForgotPasswordData) {
    const validated = forgotPasswordSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If this email exists, a password reset link has been sent.' };
    }

    // Generate reset token
    const resetToken = generateResetToken();

    // Store reset token in Redis
    await redis.setex(
      `reset:${resetToken}`,
      this.RESET_TOKEN_EXPIRY,
      validated.email
    );

    // Generate reset link
    const resetLink = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Log in development
    if (env.NODE_ENV === 'development') {
      logger.info(`🔗 Password reset link for ${validated.email}: ${resetLink}`);
    } else {
      // TODO: Send email with reset link
      logger.info(`🔗 Password reset email sent to ${validated.email}`);
    }

    return { message: 'If this email exists, a password reset link has been sent.' };
  }

  /**
   * Reset password using token
   */
  async resetPassword(data: ResetPasswordData) {
    const validated = resetPasswordSchema.parse(data);

    // Get email from Redis using reset token
    const email = await redis.get(`reset:${validated.token}`);

    if (!email) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(validated.newPassword, this.SALT_ROUNDS);

    // Update user's password
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    // Delete reset token from Redis
    await redis.del(`reset:${validated.token}`);

    logger.info(`✅ Password reset successful for ${email}`);

    return { message: 'Password reset successful. You can now login with your new password.' };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(data: RefreshTokenData) {
    const validated = refreshTokenSchema.parse(data);

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(validated.refreshToken);
    } catch {
      throw new Error('Invalid refresh token');
    }

    // Check if refresh token exists in Redis
    const storedToken = await redis.get(`refresh:${decoded.userId}`);

    if (!storedToken || storedToken !== validated.refreshToken) {
      throw new Error('Refresh token has been revoked');
    }

    // Get user for token generation
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new Error('User not found or deactivated');
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    return { accessToken };
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    // Delete refresh token from Redis
    await redis.del(`refresh:${userId}`);

    logger.info(`✅ User ${userId} logged out`);

    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user profile
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        gender: true,
        dateOfBirth: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        studentProfile: true,
        counsellorProfile: true,
        parentProfile: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();
