import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useRecommendedCareers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendedCareers'],
    queryFn: async () => {
      const response = await api.get('/careers/recommended');
      return response.data.data;
    },
  });

  return { careers: data, isLoading, error };
}
