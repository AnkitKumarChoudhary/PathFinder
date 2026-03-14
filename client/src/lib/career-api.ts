import api from './api'
import {
  Career,
  CareerCategory,
  CareerFilters,
  CareersResponse,
  SavedCareer,
} from '../types/career'

export async function fetchCareers(filters: Partial<CareerFilters>): Promise<CareersResponse> {
  const params: Record<string, string | number> = {}

  if (filters.search) params.search = filters.search
  if (filters.categories && filters.categories.length > 0) params.category = filters.categories.join(',')
  if (filters.salary) params.salary = filters.salary
  if (filters.growth) params.growth = filters.growth
  if (filters.exams && filters.exams.length > 0) params.exam = filters.exams.join(',')

  params.page = filters.page ?? 1
  params.limit = filters.limit ?? 12
  params.sort = filters.sort ?? 'relevance'

  const { data } = await api.get('/careers', { params })
  return data.data
}

export async function fetchCareer(id: string): Promise<Career> {
  const { data } = await api.get(`/careers/${id}`)
  return data.data.career
}

export async function fetchCareerCategories(): Promise<CareerCategory[]> {
  const { data } = await api.get('/careers/categories')
  return data.data.categories
}

export async function fetchRelatedCareers(id: string): Promise<Career[]> {
  const { data } = await api.get(`/careers/${id}/related`)
  return data.data.careers
}

export async function compareCareers(careerIds: string[]): Promise<Career[]> {
  const { data } = await api.post('/careers/compare', { careerIds })
  return data.data.careers
}

export async function toggleSaveCareer(careerId: string): Promise<{ isSaved: boolean }> {
  const { data } = await api.post(`/careers/${careerId}/save`)
  return data.data
}

export async function fetchSavedCareers(): Promise<SavedCareer[]> {
  const { data } = await api.get('/careers/saved')
  return data.data.savedCareers
}

export async function updateCareerNote(careerId: string, notes: string): Promise<void> {
  await api.patch(`/careers/${careerId}/note`, { notes })
}
