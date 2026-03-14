import { X } from 'lucide-react'
import { CareerFilters } from '@/types/career'

interface ActiveFiltersProps {
  filters: CareerFilters
  onRemove: (key: string, value?: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  const chips: Array<{ key: string; label: string; value?: string }> = []

  if (filters.search) chips.push({ key: 'search', label: `Search: ${filters.search}` })
  filters.categories.forEach((category) => chips.push({ key: 'category', label: category, value: category }))
  if (filters.salary) chips.push({ key: 'salary', label: `Salary: ${filters.salary}` })
  if (filters.growth) chips.push({ key: 'growth', label: `Growth: ${filters.growth}` })
  filters.exams.forEach((exam) => chips.push({ key: 'exam', label: `Exam: ${exam}`, value: exam }))

  if (chips.length === 0) return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={`${chip.key}-${chip.value || chip.label}`}
          className="inline-flex items-center gap-1 rounded-full bg-brand-forest/10 px-3 py-1.5 text-xs text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint"
        >
          {chip.label}
          <button onClick={() => onRemove(chip.key, chip.value)}>
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
      {chips.length > 1 ? (
        <button className="text-xs text-brand-terracotta hover:underline" onClick={onClearAll}>
          Clear all
        </button>
      ) : null}
    </div>
  )
}
