import api from './api'
import {
  Appointment,
  AvailabilityPayload,
  BookAppointmentPayload,
  Mentor,
  MentorAvailability,
  MentorFilters,
  MentorsResponse,
  UpdateAppointmentPayload,
} from '@/types/mentorship'

export async function fetchMentors(filters: Partial<MentorFilters>): Promise<MentorsResponse> {
  const params: Record<string, string | number> = {}

  if (filters.search) params.search = filters.search
  if (filters.specialization && filters.specialization.length > 0) {
    params.specialization = filters.specialization.join(',')
  }
  if (filters.language && filters.language.length > 0) {
    params.language = filters.language.join(',')
  }
  if (filters.minRating) params.minRating = filters.minRating
  if (filters.maxRate) params.maxRate = filters.maxRate
  if (filters.experience) params.experience = filters.experience
  if (filters.sort) params.sort = filters.sort
  params.page = filters.page ?? 1
  params.limit = filters.limit ?? 9

  const { data } = await api.get('/mentorship/mentors', { params })
  return data.data
}

export async function fetchMentorById(mentorId: string): Promise<Mentor> {
  const { data } = await api.get(`/mentorship/mentors/${mentorId}`)
  return data.data.mentor
}

export async function fetchMentorAvailability(mentorId: string, date: string): Promise<MentorAvailability> {
  const { data } = await api.get(`/mentorship/mentors/${mentorId}/availability`, {
    params: { date },
  })
  return data.data
}

export async function bookMentorshipAppointment(payload: BookAppointmentPayload): Promise<Appointment> {
  const { data } = await api.post('/mentorship/appointments', payload)
  return data.data.appointment
}

export async function fetchMyAppointments(status?: string): Promise<Appointment[]> {
  const { data } = await api.get('/mentorship/appointments', {
    params: status ? { status } : {},
  })
  return data.data.appointments
}

export async function updateMentorshipAppointment(
  appointmentId: string,
  payload: UpdateAppointmentPayload,
): Promise<Appointment> {
  const { data } = await api.patch(`/mentorship/appointments/${appointmentId}`, payload)
  return data.data.appointment
}

export async function updateMyAvailability(payload: AvailabilityPayload) {
  const { data } = await api.put('/mentorship/availability', payload)
  return data.data.profile
}
