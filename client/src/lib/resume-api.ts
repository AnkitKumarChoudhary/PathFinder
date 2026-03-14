import api from './api'
import type { Resume, ResumeSummary, ResumeData, ResumeTemplate } from '@/types/resume'

export async function fetchResumes(): Promise<ResumeSummary[]> {
  const { data } = await api.get('/resumes')
  return data.data.resumes || data.data
}

export async function fetchResume(id: string): Promise<Resume> {
  const { data } = await api.get(`/resumes/${id}`)
  return data.data.resume || data.data
}

export async function createResume(payload: {
  title?: string
  template?: ResumeTemplate
  data?: Partial<ResumeData>
}): Promise<Resume> {
  const { data } = await api.post('/resumes', payload)
  return data.data.resume || data.data
}

export async function updateResume(
  id: string,
  updates: {
    title?: string
    template?: ResumeTemplate
    data?: ResumeData
    isDefault?: boolean
  }
): Promise<Resume> {
  const { data } = await api.patch(`/resumes/${id}`, updates)
  return data.data.resume || data.data
}

export async function deleteResume(id: string): Promise<void> {
  await api.delete(`/resumes/${id}`)
}

export async function duplicateResume(id: string): Promise<Resume> {
  const { data } = await api.post(`/resumes/${id}/duplicate`)
  return data.data.resume || data.data
}
