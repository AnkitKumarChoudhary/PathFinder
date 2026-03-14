import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Activity {
  id: string;
  action: string;
  description: string;
  createdAt: string;
}

export function useRecentActivity() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const response = await api.get('/student/recent-activity');
      return response.data.data as Activity[];
    },
  });

  return { activities: data || [], isLoading, error };
}
