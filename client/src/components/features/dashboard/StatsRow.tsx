'use client';

import { ClipboardCheck, Target, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsRowProps {
  stats?: {
    assessmentsCompleted: number;
    careerMatches: number;
    upcomingSessions: number;
    profileCompletion: number;
  };
  isLoading?: boolean;
}

export function StatsRow({ stats, isLoading = false }: StatsRowProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-base p-5 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-dark-border mb-3"></div>
            <div className="w-16 h-8 bg-gray-200 dark:bg-dark-border rounded mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 dark:bg-dark-border rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Assessments Completed',
      value: stats?.assessmentsCompleted || 0,
      icon: <ClipboardCheck size={20} className="text-brand-forest" />,
      bgClass: 'bg-brand-forest/10',
    },
    {
      title: 'Career Matches',
      value: stats?.careerMatches || 0,
      icon: <Target size={20} className="text-brand-terracotta" />,
      bgClass: 'bg-brand-terracotta/10',
    },
    {
      title: 'Upcoming Sessions',
      value: stats?.upcomingSessions || 0,
      icon: <Calendar size={20} className="text-brand-sand" />,
      bgClass: 'bg-brand-sand/10',
    },
    {
      title: 'Profile Completion',
      value: `${stats?.profileCompletion || 0}%`,
      icon: <User size={20} className="text-status-info" />,
      bgClass: 'bg-status-info/10',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
    >
      {statItems.map((item, index) => (
        <div key={index} className="card-base p-5 hover:translate-y-[-2px] hover:shadow-card-hover transition-all duration-300">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${item.bgClass}`}>
            {item.icon}
          </div>
          <div className="font-mono text-heading-2 font-bold text-charcoal dark:text-gray-100">
            {item.value}
          </div>
          <div className="text-body-sm text-muted mt-1">
            {item.title}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
