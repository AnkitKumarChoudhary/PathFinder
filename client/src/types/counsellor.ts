export interface CounsellorDashboardStats {
  totalAppointments: number
  pendingCount: number
  confirmedCount: number
  completedCount: number
  uniqueStudents: number
  averageRating: number
  totalRatings: number
  thisWeekCount: number
  todayAppointments: TodayAppointment[]
  recentReviews: RecentReview[]
}

export interface TodayAppointment {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  type: string | null
  studentNotes: string | null
  student: {
    firstName: string
    lastName: string
    avatar: string | null
    email: string
  }
}

export interface RecentReview {
  id: string
  rating: number
  feedback: string | null
  updatedAt: string
  student: {
    firstName: string
    lastName: string
    avatar: string | null
  }
}

export interface CounsellorStudent {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  studentProfile: {
    dateOfBirth?: string | null
    gender?: string | null
    stream?: string | null
    school?: string | null
    city?: string | null
  } | null
  totalSessions: number
  lastSessionDate: string
  lastStatus: string
}

export interface CounsellorProfileData {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar: string | null
  counsellorProfile: {
    specializations: string[]
    qualifications: string[]
    experience: number
    bio: string | null
    hourlyRate: number | null
    rating: number | null
    totalSessions: number
    isVerified: boolean
    languages: string[]
    availableSlots: Record<string, unknown> | null
  }
}
