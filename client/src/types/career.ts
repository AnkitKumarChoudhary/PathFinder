export interface Career {
  id: string
  title: string
  category: string
  description: string
  averageSalary: string | Record<string, number> | null
  growthOutlook: string | null
  educationPath: string | null
  skills: string[]
  roadmap: CareerRoadmap | null
  dayInLife: string | null
  industries: string[]
  popularExams: string[]
  topColleges: string[]
  resources: CareerResource[] | null
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  isSaved?: boolean
}

export interface CareerRoadmap {
  steps: RoadmapStep[]
}

export interface RoadmapStep {
  year: string
  title: string
  description: string
  icon?: string
}

export interface CareerResource {
  title: string
  url: string
  type: 'article' | 'video' | 'course' | 'book'
}

export interface CareerCategory {
  name: string
  count: number
}

export interface SavedCareer {
  id: string
  userId: string
  careerId: string
  notes: string | null
  savedAt: string
  career: Career
}

export interface CareerFilters {
  search: string
  categories: string[]
  salary: '' | 'low' | 'medium' | 'high'
  growth: '' | 'High' | 'Moderate' | 'Stable' | 'Emerging'
  exams: string[]
  sort: 'relevance' | 'title_asc' | 'title_desc' | 'salary_high' | 'salary_low' | 'newest'
  page: number
  limit: number
}

export interface CareerPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CareersResponse {
  careers: Career[]
  pagination: CareerPagination
}
