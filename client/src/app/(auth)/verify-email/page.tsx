'use client';

import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const { verifyOTP, resendOTP, isLoading } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === OTP_LENGTH - 1) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === OTP_LENGTH) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
    
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split('').forEach((char, i) => {
      if (i < OTP_LENGTH) {
        newOtp[i] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(pasteData.length - 1, OTP_LENGTH - 1);
    inputRefs.current[lastFilledIndex]?.focus();

    // Auto-submit if complete
    if (pasteData.length === OTP_LENGTH) {
      handleVerify(pasteData);
    }
  };

  const handleVerify = async (otpValue?: string) => {
    const codeToVerify = otpValue || otp.join('');
    
    if (codeToVerify.length !== OTP_LENGTH) {
      toast.error('Please enter all 6 digits');
      return;
    }

    try {
      await verifyOTP(email, codeToVerify);
      setIsVerified(true);
      toast.success('Email verified successfully!');
      
      // Redirect to login after short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch {
      toast.error('Invalid verification code. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await resendOTP(email);
      toast.success('Verification code resent!');
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  // Success state
  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 dark:bg-dark-bg">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-status-success/10">
            <CheckCircle className="h-10 w-10 text-status-success" />
          </div>
          <h1 className="mb-2 font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">
            Email Verified!
          </h1>
          <p className="mb-8 text-body text-muted dark:text-dark-muted">
            Your email has been verified successfully. Redirecting to login...
          </p>
          <Link href="/login">
            <Button variant="primary" size="lg">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4 dark:bg-dark-bg">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/register"
          className="mb-8 inline-flex items-center gap-2 text-body-sm text-muted hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to registration
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
              Verify Your Email
            </h1>
            <p className="text-body text-muted dark:text-dark-muted">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="mt-1 font-medium text-charcoal dark:text-dark-text">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="mb-8 flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={cn(
                  'h-14 w-12 rounded-xl border-2 bg-surface text-center font-mono text-heading-3 text-charcoal outline-none transition-all',
                  'focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20',
                  'dark:border-dark-border dark:bg-dark-surface dark:text-dark-text',
                  digit ? 'border-brand-forest' : 'border-border'
                )}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading}
            onClick={() => handleVerify()}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Button>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-body-sm text-muted dark:text-dark-muted">
              Didn&apos;t receive the code?{' '}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-brand-forest hover:underline dark:text-brand-mint"
                >
                  Resend
                </button>
              ) : (
                <span className="font-medium text-charcoal dark:text-dark-text">
                  Resend in {countdown}s
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-body-sm text-muted dark:text-dark-muted">
          Wrong email?{' '}
          <Link
            href="/register"
            className="font-medium text-brand-forest hover:underline dark:text-brand-mint"
          >
            Go back and change it
          </Link>
        </p>
      </div>
    </div>
  );
}
