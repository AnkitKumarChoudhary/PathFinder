import api from './api'

export async function fetchCounsellorDashboard() {
  const { data } = await api.get('/counsellor/dashboard')
  return data.data
}

export async function fetchCounsellorProfile() {
  const { data } = await api.get('/counsellor/profile')
  return data.data.profile || data.data
}

export async function updateCounsellorProfile(updates: Record<string, unknown>) {
  const { data } = await api.patch('/counsellor/profile', updates)
  return data.data.profile || data.data
}

export async function fetchCounsellorStudents() {
  const { data } = await api.get('/counsellor/students')
  return data.data.students || data.data
}

export async function fetchAppointmentDetails(id: string) {
  const { data } = await api.get(`/counsellor/appointments/${id}`)
  return data.data.appointment || data.data
}
