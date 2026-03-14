import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchAppointmentDetails,
  fetchCounsellorDashboard,
  fetchCounsellorProfile,
  fetchCounsellorStudents,
  updateCounsellorProfile,
} from '@/lib/counsellor-api'

export function useCounsellorDashboard() {
  return useQuery({
    queryKey: ['counsellor-dashboard'],
    queryFn: fetchCounsellorDashboard,
    staleTime: 1000 * 60 * 1,
  })
}

export function useCounsellorProfile() {
  return useQuery({
    queryKey: ['counsellor-profile'],
    queryFn: fetchCounsellorProfile,
  })
}

export function useUpdateCounsellorProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCounsellorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellor-profile'] })
      queryClient.invalidateQueries({ queryKey: ['counsellor-dashboard'] })
      toast.success('Profile updated')
    },
    onError: () => toast.error('Failed to update profile'),
  })
}

export function useCounsellorStudents() {
  return useQuery({
    queryKey: ['counsellor-students'],
    queryFn: fetchCounsellorStudents,
  })
}

export function useAppointmentDetails(id: string) {
  return useQuery({
    queryKey: ['appointment-details', id],
    queryFn: () => fetchAppointmentDetails(id),
    enabled: !!id,
  })
}
