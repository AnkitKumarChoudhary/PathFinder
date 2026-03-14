'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Grid3X3, List, SearchX, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { CareerCard } from '@/components/features/careers/CareerCard'
import { CareerFilters } from '@/components/features/careers/CareerFilters'
import { CareerSearch } from '@/components/features/careers/CareerSearch'
import { ActiveFilters } from '@/components/features/careers/ActiveFilters'
import { CareerCardSkeleton } from '@/components/features/careers/CareerCardSkeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { useCareerCategories, useCareers } from '@/hooks/useCareers'
import { useSavedCareers, useToggleSaveCareer } from '@/hooks/useSavedCareers'
import { CareerFilters as CareerFiltersType } from '@/types/career'

const defaultFilters: CareerFiltersType = {
  search: '',
  categories: [],
  salary: '',
  growth: '',
  exams: [],
  sort: 'relevance',
  page: 1,
  limit: 12,
}

export default function CareersListingPage() {
  const [filters, setFilters] = useState<CareerFiltersType>(defaultFilters)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const debouncedSearch = useDebounce(filters.search, 300)

  const queryFilters = {
    ...filters,
    search: debouncedSearch,
  }

  const { data, isLoading } = useCareers(queryFilters)
  const { data: categories = [], isLoading: isCategoriesLoading } = useCareerCategories()
  const { data: savedCareers = [] } = useSavedCareers()
  const toggleSaveMutation = useToggleSaveCareer()

  const careers = data?.careers || []
  const savedIds = useMemo(() => new Set(savedCareers.map((saved) => saved.careerId)), [savedCareers])
  const pagination = data?.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 }

  const handleFilterChange = (partial: Partial<CareerFiltersType>) => {
    setFilters((previous) => ({ ...previous, ...partial }))
  }

  const handleRemoveFilter = (key: string, value?: string) => {
    if (key === 'search') return setFilters((prev) => ({ ...prev, search: '', page: 1 }))
    if (key === 'category' && value) {
      return setFilters((prev) => ({ ...prev, categories: prev.categories.filter((item) => item !== value), page: 1 }))
    }
    if (key === 'salary') return setFilters((prev) => ({ ...prev, salary: '', page: 1 }))
    if (key === 'growth') return setFilters((prev) => ({ ...prev, growth: '', page: 1 }))
    if (key === 'exam' && value) {
      return setFilters((prev) => ({ ...prev, exams: prev.exams.filter((item) => item !== value), page: 1 }))
    }
  }

  const clearAllFilters = () => setFilters(defaultFilters)

  const handleCompareToggle = (careerId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(careerId)) {
        return prev.filter((id) => id !== careerId)
      }
      if (prev.length >= 3) {
        toast.error('You can compare up to 3 careers at a time')
        return prev
      }
      return [...prev, careerId]
    })
  }

  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    const total = pagination.totalPages
    const current = pagination.page
    const start = Math.max(1, current - 2)
    const end = Math.min(total, start + 4)
    for (let page = start; page <= end; page += 1) pages.push(page)
    return pages
  }, [pagination.page, pagination.totalPages])

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-charcoal dark:text-dark-text">Explore Careers</h1>
        <p className="mt-2 text-slate dark:text-gray-400">
          Browse through career paths, filter by your interests, and find what excites you.
        </p>
      </div>

      <CareerSearch value={filters.search} onChange={(value) => handleFilterChange({ search: value, page: 1 })} />

      <ActiveFilters filters={filters} onRemove={handleRemoveFilter} onClearAll={clearAllFilters} />

      <div className="mt-6 flex gap-8">
        <aside className="hidden w-72 flex-shrink-0 lg:block">
          <CareerFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
            isLoading={isCategoriesLoading}
          />
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted dark:text-dark-muted">
              Showing {careers.length} of {pagination.total} careers
            </p>
            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm lg:hidden dark:border-dark-border"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>

              <div className="inline-flex overflow-hidden rounded-lg border border-border dark:border-dark-border">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-brand-forest text-white' : 'text-muted dark:text-dark-muted'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-brand-forest text-white' : 'text-muted dark:text-dark-muted'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <select
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm dark:border-dark-border dark:bg-dark-surface"
                value={filters.sort}
                onChange={(event) => handleFilterChange({ sort: event.target.value as CareerFiltersType['sort'], page: 1 })}
              >
                <option value="relevance">Relevance</option>
                <option value="title_asc">A-Z</option>
                <option value="title_desc">Z-A</option>
                <option value="salary_high">Salary High</option>
                <option value="salary_low">Salary Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <CareerCardSkeleton key={index} />
              ))}
            </div>
          ) : careers.length === 0 ? (
            <div className="py-20 text-center">
              <SearchX className="mx-auto h-12 w-12 text-muted dark:text-dark-muted" />
              <h3 className="mt-4 font-heading text-heading-3">No careers found</h3>
              <p className="mt-2 text-slate dark:text-gray-400">Try adjusting your search or filters</p>
              <Button className="mt-4" onClick={clearAllFilters}>Clear Filters</Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {careers.map((career) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  variant="grid"
                  isSaved={savedIds.has(career.id) || !!career.isSaved}
                  onSaveToggle={(careerId) => toggleSaveMutation.mutate(careerId)}
                  showCompareCheckbox
                  isSelectedForCompare={compareIds.includes(career.id)}
                  onCompareToggle={handleCompareToggle}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {careers.map((career) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  variant="list"
                  isSaved={savedIds.has(career.id) || !!career.isSaved}
                  onSaveToggle={(careerId) => toggleSaveMutation.mutate(careerId)}
                  showCompareCheckbox
                  isSelectedForCompare={compareIds.includes(career.id)}
                  onCompareToggle={handleCompareToggle}
                />
              ))}
            </div>
          )}

          {pagination.totalPages > 1 ? (
            <div className="mt-10 flex justify-center gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => handleFilterChange({ page: Math.max(1, pagination.page - 1) })}
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-dark-border dark:bg-dark-surface"
              >
                Previous
              </button>

              {pageNumbers[0] > 1 ? <span className="px-2 py-2 text-muted">...</span> : null}
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handleFilterChange({ page })}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    page === pagination.page
                      ? 'bg-brand-forest text-white'
                      : 'border border-border bg-white hover:bg-gray-50 dark:border-dark-border dark:bg-dark-surface dark:hover:bg-dark-elevated'
                  }`}
                >
                  {page}
                </button>
              ))}
              {pageNumbers[pageNumbers.length - 1] < pagination.totalPages ? <span className="px-2 py-2 text-muted">...</span> : null}

              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handleFilterChange({ page: Math.min(pagination.totalPages, pagination.page + 1) })}
                className="rounded-lg border border-border bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-dark-border dark:bg-dark-surface"
              >
                Next
              </button>
            </div>
          ) : null}
        </main>
      </div>

      <AnimatePresence>
        {isMobileFilterOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-charcoal/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 z-[60] h-full w-[88%] max-w-sm overflow-y-auto bg-surface p-4 dark:bg-dark-surface lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-heading-4">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CareerFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
                isLoading={isCategoriesLoading}
              />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {compareIds.length >= 2 ? (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
              bg-charcoal dark:bg-dark-elevated text-white
              rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4
              border border-white/10"
          >
            <span className="text-sm font-medium">
              {compareIds.length} career{compareIds.length > 1 ? 's' : ''} selected
            </span>

            <div className="h-6 w-px bg-white/20" />

            <Link
              href={`/student/careers/compare?ids=${compareIds.join(',')}`}
              className="bg-brand-terracotta hover:bg-brand-terracotta/90
                text-white text-sm font-semibold px-5 py-2 rounded-xl
                transition-colors"
            >
              Compare Now
            </Link>

            <button
              onClick={() => setCompareIds([])}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
