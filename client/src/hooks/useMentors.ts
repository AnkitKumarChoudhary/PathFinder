import { useQuery } from '@tanstack/react-query'
import { fetchMentorAvailability, fetchMentorById, fetchMentors } from '@/lib/mentorship-api'
import { MentorFilters } from '@/types/mentorship'

export function useMentors(filters: Partial<MentorFilters>) {
  return useQuery({
    queryKey: ['mentors', filters],
    queryFn: () => fetchMentors(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useMentor(mentorId: string) {
  return useQuery({
    queryKey: ['mentor', mentorId],
    queryFn: () => fetchMentorById(mentorId),
    enabled: Boolean(mentorId),
  })
}

export function useMentorAvailability(mentorId: string, date: string) {
  return useQuery({
    queryKey: ['mentor-availability', mentorId, date],
    queryFn: () => fetchMentorAvailability(mentorId, date),
    enabled: Boolean(mentorId && date),
    staleTime: 1000 * 30,
  })
}
