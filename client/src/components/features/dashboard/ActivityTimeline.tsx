'use client';

import { motion } from 'framer-motion';
import { timeAgo } from '@/lib/utils';
import { Activity as ActivityIcon } from 'lucide-react';

interface Activity {
  id: string;
  action: string;
  description: string;
  createdAt: string;
}

interface ActivityTimelineProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export function ActivityTimeline({ activities = [], isLoading = false }: ActivityTimelineProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="card-base p-6 w-full"
    >
      <h3 className="font-heading text-heading-3 text-charcoal dark:text-gray-100 mb-6">Recent Activity</h3>

      {isLoading ? (
        <div className="flex flex-col gap-6 ml-3 pl-4 border-l border-gray-200 dark:border-dark-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex flex-col gap-2 relative">
              <div className="absolute -left-[23px] top-1 w-3 h-3 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-dark-border rounded"></div>
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-dark-border rounded"></div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted">
          <ActivityIcon size={32} className="mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-sm">No recent activity detected.</p>
        </div>
      ) : (
        <div className="relative border-l border-gray-200 dark:border-dark-border ml-3 space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-forest ring-4 ring-white dark:ring-dark-surface dark:bg-brand-sage"></div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium text-charcoal dark:text-gray-200">
                  {activity.description}
                </span>
                <span className="text-xs text-muted mt-1">
                  {timeAgo(activity.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
