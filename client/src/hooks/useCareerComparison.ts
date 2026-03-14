import { useQuery } from '@tanstack/react-query'
import { compareCareers } from '../lib/career-api'

export function useCareerComparison(careerIds: string[]) {
  return useQuery({
    queryKey: ['career-comparison', careerIds],
    queryFn: () => compareCareers(careerIds),
    enabled: careerIds.length >= 2,
  })
}
