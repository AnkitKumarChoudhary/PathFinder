'use client';

import { useAuthStore } from '@/store/authStore';
import { getGreeting } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface WelcomeBannerProps {
  assessmentsCompleted?: number;
  profileCompletion?: number;
  isLoading?: boolean;
}

export function WelcomeBanner({ 
  assessmentsCompleted = 0, 
  profileCompletion = 0,
  isLoading = false
}: WelcomeBannerProps) {
  const { user } = useAuthStore();
  const greeting = getGreeting();
  const firstName = user?.firstName || 'Student';

  if (isLoading) {
    return (
      <div className="w-full h-40 bg-gray-200 animate-pulse rounded-2xl dark:bg-dark-elevated"></div>
    );
  }

  // Calculate circumference for the circle progress
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (profileCompletion / 100) * circumference;

  if (assessmentsCompleted === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-forest rounded-2xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md"
      >
        <div>
          <h2 className="font-heading text-heading-2 font-bold mb-2">Let&apos;s Discover Your Career Path! 🚀</h2>
          <p className="text-white/80 max-w-xl">
            Take your first assessment to unlock personalized career recommendations tailored to your unique strengths and interests.
          </p>
        </div>
        <Link 
          href="/student/assessment" 
          className="btn-primary whitespace-nowrap bg-brand-sand text-charcoal hover:bg-brand-sand/90"
        >
          Start Assessment
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-forest rounded-2xl p-6 md:p-8 text-white flex justify-between items-center shadow-md"
    >
      <div>
        <h2 className="font-heading text-heading-2 font-bold mb-2">
          {greeting}, {firstName}! 👋
        </h2>
        <p className="text-white/80 mb-4">
          Here&apos;s what&apos;s happening with your career journey.
        </p>
        
        {profileCompletion < 70 && (
          <Link href="/student/profile" className="text-sm font-medium text-brand-sand hover:underline flex items-center gap-1">
            Complete your profile to get better recommendations &rarr;
          </Link>
        )}
      </div>

      <div className="hidden md:flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/20"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-brand-sand transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xl font-bold">{profileCompletion}%</span>
          </div>
        </div>
        <span className="text-xs text-white/70 mt-2 font-medium">Profile Complete</span>
      </div>
    </motion.div>
  );
}
