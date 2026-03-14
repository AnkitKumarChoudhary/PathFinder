import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useUpcomingAppointments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const response = await api.get('/student/upcoming-appointments');
      return response.data.data;
    },
  });

  return { appointments: data, isLoading, error };
}
