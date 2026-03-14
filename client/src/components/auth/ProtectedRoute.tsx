'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute - Wraps pages that require authentication
 * Redirects to login if not authenticated
 * Optionally restricts by role
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, hasHydrated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!hasHydrated || isLoading) {
      setIsChecking(true);
      return;
    }

    const checkAuth = () => {
      if (!isAuthenticated || !user) {
        // Store intended destination
        sessionStorage.setItem('redirectAfterLogin', pathname);
        router.replace('/login');
        return;
      }

      // Check role if specified
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to user's dashboard if they don't have access
        const { getDashboardRoute } = useAuthStore.getState();
        router.replace(getDashboardRoute());
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [hasHydrated, isLoading, isAuthenticated, user, allowedRoles, router, pathname]);

  // Show loading while checking auth
  if (isChecking || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-forest border-t-transparent" />
          <p className="text-body text-muted dark:text-dark-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
