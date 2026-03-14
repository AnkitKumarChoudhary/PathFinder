'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useAuthStore, getDashboardRoute } from '@/store/authStore';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      if (user) {
        toast.success(`Welcome back, ${user.firstName}!`);
        router.push(getDashboardRoute(user.role));
      }
    } catch {
      toast.error(error || 'Invalid email or password');
    }
  };

  const handleGoogleLogin = () => {
    toast('Google login coming soon', { icon: '🚧' });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center bg-brand-cream px-6 py-12 dark:bg-dark-bg lg:w-[55%] lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link
            href="/"
            className="mb-8 inline-block font-heading text-heading-2 font-bold text-brand-forest dark:text-brand-mint"
          >
            PathFinder
          </Link>

          {/* Header */}
          <h1 className="mb-2 font-heading text-heading-1 font-bold text-charcoal dark:text-dark-text">
            Welcome back
          </h1>
          <p className="mb-8 text-body text-muted dark:text-dark-muted">
            Sign in to continue your career journey
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 rounded-lg border border-status-error/30 bg-status-error/10 px-4 py-3 text-body-sm text-status-error">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {/* Remember me / Forgot password */}
            <div className="flex items-center justify-between">
              <Checkbox label="Remember me" {...register('rememberMe')} />
              <Link
                href="/forgot-password"
                className="text-body-sm font-medium text-brand-forest hover:underline dark:text-brand-mint"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border dark:border-dark-border" />
            </div>
            <div className="relative flex justify-center text-body-sm">
              <span className="bg-brand-cream px-4 text-muted dark:bg-dark-bg dark:text-dark-muted">
                or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Sign up link */}
          <p className="mt-8 text-center text-body-sm text-muted dark:text-dark-muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-brand-forest hover:underline dark:text-brand-mint"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative (hidden on mobile) */}
      <div className="relative hidden bg-brand-forest lg:flex lg:w-[45%] lg:flex-col lg:items-center lg:justify-center lg:p-12">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          <blockquote className="mb-6 font-heading text-heading-2 font-bold leading-tight text-white">
            &ldquo;The right career isn&apos;t found by chance. It&apos;s discovered through
            guidance.&rdquo;
          </blockquote>
          <p className="text-body text-brand-mint">— PathFinder</p>

          {/* Stats */}
          <div className="mt-12 flex justify-center gap-12">
            <div>
              <p className="font-mono text-heading-1 font-bold text-white">10,000+</p>
              <p className="text-body-sm text-brand-mint">Students Guided</p>
            </div>
            <div>
              <p className="font-mono text-heading-1 font-bold text-white">95%</p>
              <p className="text-body-sm text-brand-mint">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-sage/30" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-brand-mint/20" />
      </div>
    </div>
  );
}
