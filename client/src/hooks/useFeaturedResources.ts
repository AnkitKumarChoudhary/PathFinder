import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  provider?: string;
  difficulty?: string;
  isFeatured: boolean;
  isFree: boolean;
}

export function useFeaturedResources() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredResources'],
    queryFn: async () => {
      const response = await api.get('/resources/featured');
      return response.data.data as Resource[];
    },
  });

  return { resources: data || [], isLoading, error };
}
