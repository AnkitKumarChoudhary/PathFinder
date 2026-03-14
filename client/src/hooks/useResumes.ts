import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchResumes,
  fetchResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from '@/lib/resume-api'
import type { ResumeData, ResumeTemplate } from '@/types/resume'
import toast from 'react-hot-toast'

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: fetchResumes,
  })
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => fetchResume(id),
    enabled: !!id,
  })
}

export function useCreateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { title?: string; template?: ResumeTemplate; data?: Partial<ResumeData> }) =>
      createResume(payload),
    onSuccess: (createdResume) => {
      queryClient.setQueryData(['resume', createdResume.id], createdResume)
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Resume created!')
    },
    onError: () => toast.error('Failed to create resume'),
  })
}

export function useUpdateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: {
        title?: string
        template?: ResumeTemplate
        data?: ResumeData
        isDefault?: boolean
      }
    }) => updateResume(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['resume', id] })
    },
    onError: () => toast.error('Failed to save resume'),
  })
}

export function useDeleteResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Resume deleted')
    },
    onError: () => toast.error('Failed to delete resume'),
  })
}

export function useDuplicateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: duplicateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      toast.success('Resume duplicated!')
    },
    onError: () => toast.error('Failed to duplicate resume'),
  })
}
