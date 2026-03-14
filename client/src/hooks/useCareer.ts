import { useQuery } from '@tanstack/react-query'
import { fetchCareer, fetchRelatedCareers } from '../lib/career-api'

export function useCareer(id: string) {
  return useQuery({
    queryKey: ['career', id],
    queryFn: () => fetchCareer(id),
    enabled: !!id,
  })
}

export function useRelatedCareers(id: string) {
  return useQuery({
    queryKey: ['related-careers', id],
    queryFn: () => fetchRelatedCareers(id),
    enabled: !!id,
  })
}
