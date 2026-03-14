import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  createAdminCareer,
  deleteAdminCareer,
  fetchAdminAssessments,
  fetchAdminCareers,
  fetchAdminDashboard,
  fetchAdminInquiries,
  fetchAdminUser,
  fetchAdminUsers,
  updateAdminCareer,
  updateUserStatus,
} from '@/lib/admin-api'

type QueryParams = {
  [key: string]: string | number | boolean | null | undefined
}

type CareerUpdatePayload = {
  [key: string]: unknown
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboard,
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminUsers(params: QueryParams) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => fetchAdminUsers(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => fetchAdminUser(id),
    enabled: !!id,
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updateUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      toast.success('User status updated')
    },
    onError: () => toast.error('Failed to update user status'),
  })
}

export function useAdminCareers(params: QueryParams) {
  return useQuery({
    queryKey: ['admin-careers', params],
    queryFn: () => fetchAdminCareers(params),
    placeholderData: (previousData) => previousData,
  })
}

export function useCreateCareer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAdminCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-careers'] })
      toast.success('Career created')
    },
    onError: () => toast.error('Failed to create career'),
  })
}

export function useUpdateCareer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CareerUpdatePayload }) => updateAdminCareer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-careers'] })
      toast.success('Career updated')
    },
    onError: () => toast.error('Failed to update career'),
  })
}

export function useDeleteCareer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAdminCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-careers'] })
      toast.success('Career deleted')
    },
    onError: () => toast.error('Failed to delete career'),
  })
}

export function useAdminAssessments() {
  return useQuery({
    queryKey: ['admin-assessments'],
    queryFn: fetchAdminAssessments,
  })
}

export function useAdminInquiries(params: QueryParams) {
  return useQuery({
    queryKey: ['admin-inquiries', params],
    queryFn: () => fetchAdminInquiries(params),
    placeholderData: (previousData) => previousData,
  })
}
