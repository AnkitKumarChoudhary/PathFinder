'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const { resetPassword, isLoading } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-status-error',
    'bg-status-error',
    'bg-status-warning',
    'bg-status-success',
    'bg-status-success',
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new one.');
      return;
    }

    try {
      await resetPassword(token, data.password);
      setIsReset(true);
      toast.success('Password reset successfully!');
    } catch {
      toast.error('Failed to reset password. The link may have expired.');
    }
  };

  // No token provided
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 dark:bg-dark-bg">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-status-error/10">
            <AlertCircle className="h-10 w-10 text-status-error" />
          </div>
          <h1 className="mb-2 font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
            Invalid Reset Link
          </h1>
          <p className="mb-8 text-body text-muted dark:text-dark-muted">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/forgot-password">
            <Button variant="primary" size="lg">
              Request New Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isReset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 dark:bg-dark-bg">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-status-success/10">
            <CheckCircle className="h-10 w-10 text-status-success" />
          </div>
          <h1 className="mb-2 font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
            Password Reset!
          </h1>
          <p className="mb-8 text-body text-muted dark:text-dark-muted">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Link href="/login">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                router.push('/login');
              }}
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 dark:bg-dark-bg">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-surface p-8 shadow-soft dark:bg-dark-surface">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-forest">
            <Lock className="h-8 w-8 text-white" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
              Create New Password
            </h1>
            <p className="text-body text-muted dark:text-dark-muted">
              Your new password must be different from previously used passwords.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password */}
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                {...register('password')}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 flex-1 rounded-full transition-all',
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-border'
                      )}
                    />
                  ))}
                </div>
                <p className="text-body-sm text-muted dark:text-dark-muted">
                  Password strength:{' '}
                  <span
                    className={cn(
                      'font-medium',
                      passwordStrength <= 2 && 'text-status-error',
                      passwordStrength === 3 && 'text-status-warning',
                      passwordStrength >= 4 && 'text-status-success'
                    )}
                  >
                    {strengthLabels[passwordStrength - 1] || 'Too Weak'}
                  </span>
                </p>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-muted hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-body-sm text-muted dark:text-dark-muted">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-brand-forest hover:underline dark:text-brand-mint"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-cream dark:bg-dark-bg">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-forest border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
