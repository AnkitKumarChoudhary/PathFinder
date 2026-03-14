import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  assessmentsCompleted: number;
  careerMatches: number;
  upcomingSessions: number;
  profileCompletion: number;
  savedCareersCount: number;
  totalResourcesViewed: number;
}

export function useStudentDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['studentDashboardStats'],
    queryFn: async () => {
      const response = await api.get('/student/dashboard-stats');
      return response.data.data as DashboardStats;
    },
  });

  return { stats: data, isLoading, error };
}
