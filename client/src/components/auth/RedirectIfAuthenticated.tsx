'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/authStore';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

/**
 * RedirectIfAuthenticated - Wraps auth pages (login, register, etc.)
 * Redirects to dashboard if already authenticated
 */
export function RedirectIfAuthenticated({ children }: RedirectIfAuthenticatedProps) {
  const router = useRouter();
  const { isAuthenticated, user, hasHydrated, getDashboardRoute } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!hasHydrated) {
      setIsChecking(true);
      return;
    }

    if (isAuthenticated && user) {
      router.replace(getDashboardRoute());
      return;
    }

    setIsChecking(false);
  }, [hasHydrated, isAuthenticated, user, getDashboardRoute, router]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream dark:bg-dark-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-forest border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
