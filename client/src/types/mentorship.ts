export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'NO_SHOW'

export interface Mentor {
  id: string
  profileId: string
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  specializations: string[]
  qualifications: string[]
  experience: number
  bio: string | null
  hourlyRate: number | null
  rating: number
  totalSessions: number
  languages: string[]
  availableSlots: Record<string, unknown> | null
}

export interface MentorFilters {
  search: string
  specialization: string[]
  language: string[]
  minRating: number
  maxRate?: number
  experience?: '0-2' | '3-5' | '5-10' | '10+'
  sort:
    | 'rating_desc'
    | 'rating_asc'
    | 'experience_desc'
    | 'experience_asc'
    | 'rate_low'
    | 'rate_high'
    | 'sessions_desc'
    | 'name_asc'
  page: number
  limit: number
}

export interface MentorsPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface MentorsResponse {
  mentors: Mentor[]
  pagination: MentorsPagination
}

export interface TimeSlot {
  start: string
  end: string
}

export interface MentorAvailability {
  date: string
  dayOfWeek: string
  availableSlots: TimeSlot[]
  bookedSlots: TimeSlot[]
}

export interface AppointmentUser {
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  counsellorProfile?: {
    specializations: string[]
  }
}

export interface Appointment {
  id: string
  studentId: string
  counsellorId: string
  scheduledAt: string
  duration: number
  status: AppointmentStatus
  meetingLink?: string | null
  notes?: string | null
  cancelReason?: string | null
  rating?: number | null
  feedback?: string | null
  topic?: string | null
  type?: string | null
  studentNotes?: string | null
  counsellorNotes?: string | null
  createdAt: string
  updatedAt: string
  date: string
  startTime: string
  endTime: string
  counsellor?: AppointmentUser
  student?: AppointmentUser
}

export interface BookAppointmentPayload {
  counsellorId: string
  date: string
  startTime: string
  endTime: string
  type: 'general' | 'career-planning' | 'exam-strategy' | 'study-abroad' | 'skill-development'
  studentNotes?: string
}

export interface UpdateAppointmentPayload {
  status?: AppointmentStatus
  counsellorNotes?: string
  meetingLink?: string
  cancelReason?: string
  rating?: number
  feedback?: string
}

export interface AvailabilityPayload {
  slots: Record<string, TimeSlot[]>
}
