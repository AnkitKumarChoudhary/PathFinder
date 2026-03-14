import { useQuery } from '@tanstack/react-query'
import { fetchCareers, fetchCareerCategories } from '../lib/career-api'
import { CareerFilters } from '../types/career'

export function useCareers(filters: Partial<CareerFilters>) {
  return useQuery({
    queryKey: ['careers', filters],
    queryFn: () => fetchCareers(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCareerCategories() {
  return useQuery({
    queryKey: ['career-categories'],
    queryFn: fetchCareerCategories,
    staleTime: 1000 * 60 * 10,
  })
}
