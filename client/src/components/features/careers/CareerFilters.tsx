import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { CareerCategory, CareerFilters as CareerFiltersType } from '@/types/career'

interface CareerFiltersProps {
  filters: CareerFiltersType
  onFilterChange: (filters: Partial<CareerFiltersType>) => void
  categories: CareerCategory[]
  isLoading?: boolean
}

const examOptions = ['JEE Main', 'JEE Advanced', 'NEET', 'CLAT', 'CAT', 'UPSC', 'GATE', 'NDA', 'CUET', 'NIFT']

function FiltersContent({ filters, onFilterChange, categories, isLoading }: CareerFiltersProps) {
  const toggleArrayValue = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

  const clearAll = () => {
    onFilterChange({
      categories: [],
      salary: '',
      growth: '',
      exams: [],
      search: '',
      page: 1,
      sort: 'relevance',
      limit: 12,
    })
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Categories</h3>
      <div className="space-y-2">
        {isLoading ? <p className="text-sm text-muted">Loading categories...</p> : null}
        {categories.map((category) => (
          <label key={category.name} className="flex items-center gap-2.5 text-sm text-charcoal dark:text-dark-text">
            <input
              type="checkbox"
              checked={filters.categories.includes(category.name)}
              onChange={() => onFilterChange({ categories: toggleArrayValue(filters.categories, category.name), page: 1 })}
            />
            <span>{category.name}</span>
            <span className="text-xs text-muted dark:text-dark-muted">({category.count})</span>
          </label>
        ))}
      </div>

      <div className="my-4 border-t border-gray-100 dark:border-dark-border" />

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Salary Range</h3>
      <div className="flex flex-col gap-2">
        {[
          { label: 'Under ₹5 LPA', value: 'low' as const },
          { label: '₹5–15 LPA', value: 'medium' as const },
          { label: 'Above ₹15 LPA', value: 'high' as const },
        ].map((item) => (
          <button
            key={item.value}
            className={`rounded-lg border px-3 py-2 text-left text-sm ${
              filters.salary === item.value
                ? 'border-brand-forest bg-brand-forest/10 text-brand-forest'
                : 'border-border text-slate dark:border-dark-border dark:text-dark-muted'
            }`}
            onClick={() => onFilterChange({ salary: filters.salary === item.value ? '' : item.value, page: 1 })}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="my-4 border-t border-gray-100 dark:border-dark-border" />

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Growth Outlook</h3>
      <div className="flex flex-wrap gap-2">
        {['High', 'Moderate', 'Stable', 'Emerging'].map((item) => (
          <button
            key={item}
            className={`rounded-full px-3 py-1.5 text-xs ${
              filters.growth === item
                ? 'bg-brand-forest text-white'
                : 'bg-brand-cream text-charcoal dark:bg-dark-elevated dark:text-dark-text'
            }`}
            onClick={() => onFilterChange({ growth: filters.growth === item ? '' : (item as CareerFiltersType['growth']), page: 1 })}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="my-4 border-t border-gray-100 dark:border-dark-border" />

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Related Exams</h3>
      <div className="space-y-2">
        {examOptions.map((exam) => (
          <label key={exam} className="flex items-center gap-2.5 text-sm text-charcoal dark:text-dark-text">
            <input
              type="checkbox"
              checked={filters.exams.includes(exam)}
              onChange={() => onFilterChange({ exams: toggleArrayValue(filters.exams, exam), page: 1 })}
            />
            <span>{exam}</span>
          </label>
        ))}
      </div>

      <div className="my-4 border-t border-gray-100 dark:border-dark-border" />

      <button className="text-sm text-brand-terracotta hover:underline" onClick={clearAll}>
        Clear All Filters
      </button>
    </div>
  )
}

export function CareerFilters(props: CareerFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      <div className="hidden lg:block">
        <div className="sticky top-24 w-72 self-start">
          <FiltersContent {...props} />
        </div>
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm lg:hidden dark:border-dark-border"
        onClick={() => setIsMobileOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </button>

      <AnimatePresence>
        {isMobileOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-charcoal/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 z-[60] h-full w-[88%] max-w-sm overflow-y-auto bg-surface p-4 dark:bg-dark-surface lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-heading-4">Filters</h3>
                <button onClick={() => setIsMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FiltersContent {...props} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
