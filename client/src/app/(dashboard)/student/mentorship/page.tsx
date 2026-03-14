'use client'

import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import { MentorFilters as MentorFiltersType, Mentor } from '@/types/mentorship'
import { useMentors } from '@/hooks/useMentors'
import { useDebounce } from '@/hooks/useDebounce'
import { MentorCard } from '@/components/features/mentorship/MentorCard'
import { MentorFilters } from '@/components/features/mentorship/MentorFilters'
import { BookingModal } from '@/components/features/mentorship/BookingModal'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'

const initialFilters: MentorFiltersType = {
  search: '',
  specialization: [],
  language: [],
  minRating: 0,
  sort: 'rating_desc',
  page: 1,
  limit: 9,
}

export default function MentorshipPage() {
  const [filters, setFilters] = useState<MentorFiltersType>(initialFilters)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)

  const debouncedSearch = useDebounce(filters.search, 350)

  const queryFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  )

  const { data, isLoading } = useMentors(queryFilters)

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-heading-2">Career Mentorship Programs</h1>
        <p className="mt-1 text-body text-muted dark:text-dark-muted">
          Connect with experienced mentors and book one-on-one guidance sessions.
        </p>
      </div>

      <MentorFilters
        value={filters}
        onChange={(next) => setFilters(next as MentorFiltersType)}
        onReset={() => setFilters(initialFilters)}
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-60 animate-pulse rounded-2xl bg-gray-100 dark:bg-dark-elevated" />
          ))}
        </div>
      ) : data?.mentors?.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} onBookNow={(target) => setSelectedMentor(target)} />
            ))}
          </div>

          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            pageSize={data.pagination.limit}
            totalItems={data.pagination.total}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </>
      ) : (
        <EmptyState
          icon={Users}
          title="No mentors found"
          description="Try adjusting your filters to discover more mentorship options."
        />
      )}

      <BookingModal isOpen={Boolean(selectedMentor)} onClose={() => setSelectedMentor(null)} mentor={selectedMentor} />
    </div>
  )
}
