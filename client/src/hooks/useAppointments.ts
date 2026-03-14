import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  bookMentorshipAppointment,
  fetchMyAppointments,
  updateMentorshipAppointment,
} from '@/lib/mentorship-api'
import { BookAppointmentPayload, UpdateAppointmentPayload } from '@/types/mentorship'

export function useMyAppointments(status?: string) {
  return useQuery({
    queryKey: ['my-appointments', status],
    queryFn: () => fetchMyAppointments(status),
  })
}

export function useBookAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BookAppointmentPayload) => bookMentorshipAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['mentor-availability'] })
      toast.success('Appointment booked! Waiting for confirmation.')
    },
    onError: (error: unknown) => {
      const maybeError = error as { response?: { data?: { message?: string } } }
      const msg = maybeError?.response?.data?.message || 'Failed to book appointment'
      toast.error(msg)
    },
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      appointmentId,
      payload,
    }: {
      appointmentId: string
      payload: UpdateAppointmentPayload
    }) => updateMentorshipAppointment(appointmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Appointment updated')
    },
    onError: () => {
      toast.error('Unable to update appointment')
    },
  })
}
