import { Bookmark } from 'lucide-react'
import { useToggleSaveCareer } from '@/hooks/useSavedCareers'
import { cn } from '@/lib/utils'

interface SaveCareerButtonProps {
  careerId: string
  isSaved: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
}

export function SaveCareerButton({ careerId, isSaved, size = 'md', showLabel = false }: SaveCareerButtonProps) {
  const toggleMutation = useToggleSaveCareer()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    toggleMutation.mutate(careerId)
  }

  return (
    <button
      onClick={handleClick}
      disabled={toggleMutation.isPending}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-2 py-1 transition',
        toggleMutation.isPending && 'animate-pulse',
        isSaved ? 'text-brand-terracotta' : 'text-muted hover:text-brand-terracotta'
      )}
    >
      <Bookmark
        size={iconSize[size]}
        className={isSaved ? 'fill-brand-terracotta text-brand-terracotta' : 'text-current'}
      />
      {showLabel ? <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save'}</span> : null}
    </button>
  )
}
