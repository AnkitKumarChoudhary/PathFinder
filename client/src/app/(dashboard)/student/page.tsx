'use client';

import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { useRecommendedCareers } from '@/hooks/useRecommendedCareers';
import { useUpcomingAppointments } from '@/hooks/useUpcomingAppointments';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { useFeaturedResources } from '@/hooks/useFeaturedResources';

import { WelcomeBanner } from '@/components/features/dashboard/WelcomeBanner';
import { StatsRow } from '@/components/features/dashboard/StatsRow';
import { RecommendedCareers } from '@/components/features/dashboard/RecommendedCareers';
import { UpcomingAppointments } from '@/components/features/dashboard/UpcomingAppointments';
import { RecentResources } from '@/components/features/dashboard/RecentResources';
import { ActivityTimeline } from '@/components/features/dashboard/ActivityTimeline';
import { QuickActions } from '@/components/features/dashboard/QuickActions';

export default function StudentDashboardPage() {
  const { stats, isLoading: isStatsLoading } = useStudentDashboard();
  const { careers, isLoading: isCareersLoading } = useRecommendedCareers();
  const { appointments, isLoading: isAppointmentsLoading } = useUpcomingAppointments();
  const { activities, isLoading: isActivitiesLoading } = useRecentActivity();
  const { resources, isLoading: isResourcesLoading } = useFeaturedResources();

  return (
    <div className="flex flex-col gap-8 pb-10">
      <WelcomeBanner 
        assessmentsCompleted={stats?.assessmentsCompleted}
        profileCompletion={stats?.profileCompletion}
        isLoading={isStatsLoading}
      />
      
      <StatsRow 
        stats={stats}
        isLoading={isStatsLoading}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <QuickActions />
          <RecommendedCareers 
            careers={careers} 
            isLoading={isCareersLoading} 
          />
          <RecentResources 
            resources={resources} 
            isLoading={isResourcesLoading} 
          />
        </div>
        
        <div className="flex flex-col gap-8">
          <UpcomingAppointments 
            appointments={appointments} 
            isLoading={isAppointmentsLoading} 
          />
          <ActivityTimeline 
            activities={activities} 
            isLoading={isActivitiesLoading} 
          />
        </div>
      </div>
    </div>
  );
}
