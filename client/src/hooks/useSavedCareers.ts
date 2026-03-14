import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchSavedCareers, toggleSaveCareer, updateCareerNote } from '../lib/career-api'
import toast from 'react-hot-toast'

export function useSavedCareers() {
  return useQuery({
    queryKey: ['saved-careers'],
    queryFn: fetchSavedCareers,
  })
}

export function useToggleSaveCareer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (careerId: string) => toggleSaveCareer(careerId),
    onSuccess: (data, careerId) => {
      queryClient.invalidateQueries({ queryKey: ['saved-careers'] })
      queryClient.invalidateQueries({ queryKey: ['career', careerId] })
      queryClient.invalidateQueries({ queryKey: ['careers'] })

      toast.success(data.isSaved ? 'Career saved!' : 'Removed from saved')
    },
    onError: () => {
      toast.error('Failed to update. Please try again.')
    },
  })
}

export function useUpdateCareerNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ careerId, notes }: { careerId: string; notes: string }) =>
      updateCareerNote(careerId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-careers'] })
      toast.success('Note updated')
    },
    onError: () => {
      toast.error('Failed to save note')
    },
  })
}
