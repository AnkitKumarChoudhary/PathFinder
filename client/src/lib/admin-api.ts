import api from './api'

type QueryParams = {
  [key: string]: string | number | boolean | null | undefined
}

type CareerPayload = {
  [key: string]: unknown
}

export async function fetchAdminDashboard() {
  const { data } = await api.get('/admin/dashboard')
  return data.data
}

export async function fetchAdminUsers(params: QueryParams) {
  const { data } = await api.get('/admin/users', { params })
  return data.data
}

export async function fetchAdminUser(id: string) {
  const { data } = await api.get(`/admin/users/${id}`)
  return data.data
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const { data } = await api.patch(`/admin/users/${id}/status`, { isActive })
  return data.data
}

export async function fetchAdminCareers(params: QueryParams) {
  const { data } = await api.get('/admin/careers', { params })
  return data.data
}

export async function createAdminCareer(careerData: CareerPayload) {
  const { data } = await api.post('/admin/careers', careerData)
  return data.data
}

export async function updateAdminCareer(id: string, updates: CareerPayload) {
  const { data } = await api.patch(`/admin/careers/${id}`, updates)
  return data.data
}

export async function deleteAdminCareer(id: string) {
  const { data } = await api.delete(`/admin/careers/${id}`)
  return data.data
}

export async function fetchAdminAssessments() {
  const { data } = await api.get('/admin/assessments')
  return data.data
}

export async function fetchAdminInquiries(params: QueryParams) {
  const { data } = await api.get('/admin/inquiries', { params })
  return data.data
}
