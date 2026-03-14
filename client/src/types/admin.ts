export interface AdminDashboardStats {
  userCounts: {
    students: number
    counsellors: number
    parents: number
    admins: number
    total: number
  }
  totalCareers: number
  totalAssessments: number
  totalAttempts: number
  totalAppointments: number
  appointmentBreakdown: { status: string; count: number }[]
  newUsersThisMonth: number
  newUsersThisWeek: number
  attemptsThisMonth: number
  appointmentsThisMonth: number
  registrationTrend: { month: string; count: number }[]
  popularCareers: { careerId: string; title: string; count: number }[]
  recentActivity: ActivityLogItem[]
}

export interface ActivityLogItem {
  id: string
  action: string
  details: string | null
  createdAt: string
  user: {
    firstName: string
    lastName: string
    role: string
  }
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  avatar: string | null
  emailVerified: boolean
  isActive: boolean
  phone: string | null
  createdAt: string
  _count?: {
    studentAppointments?: number
    assessmentAttempts?: number
  }
}

export interface AdminCareer {
  id: string
  title: string
  category: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: { savedBy?: number }
}

export interface AdminAssessment {
  id: string
  title: string
  description: string
  type: string
  duration: number | null
  totalQuestions: number
  isActive: boolean
  _count: { questions: number }
}

export interface AdminPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}
