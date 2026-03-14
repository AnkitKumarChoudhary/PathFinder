'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch {
      // Still show success (security: don't reveal if email exists)
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('If an account exists, you will receive a reset link.');
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 dark:bg-dark-bg">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl bg-surface p-8 shadow-soft dark:bg-dark-surface">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10">
              <CheckCircle className="h-8 w-8 text-status-success" />
            </div>

            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="mb-2 font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
                Check Your Email
              </h1>
              <p className="text-body text-muted dark:text-dark-muted">
                We&apos;ve sent password reset instructions to:
              </p>
              <p className="mt-2 font-medium text-charcoal dark:text-dark-text">{submittedEmail}</p>
            </div>

            {/* Instructions */}
            <div className="mb-8 rounded-xl bg-brand-cream/50 p-4 dark:bg-dark-bg/50">
              <h3 className="mb-2 font-medium text-charcoal dark:text-dark-text">Next steps:</h3>
              <ol className="list-inside list-decimal space-y-1 text-body-sm text-muted dark:text-dark-muted">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the reset link in the email</li>
                <li>Create your new password</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/login">
                <Button variant="primary" size="lg" className="w-full">
                  Back to Login
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full text-center text-body-sm font-medium text-brand-forest hover:underline dark:text-brand-mint"
              >
                Didn&apos;t receive email? Try again
              </button>
            </div>
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 dark:bg-dark-bg">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-body-sm text-muted hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        {/* Card */}
        <div className="rounded-2xl bg-surface p-8 shadow-soft dark:bg-dark-surface">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-forest">
            <Mail className="h-8 w-8 text-white" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
              Forgot Password?
            </h1>
            <p className="text-body text-muted dark:text-dark-muted">
              No worries! Enter your email and we&apos;ll send you reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
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
