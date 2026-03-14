'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'
import { useCareers } from '@/hooks/useCareers'
import { useCareerComparison } from '@/hooks/useCareerComparison'
import CareerSelector from '@/components/features/careers/CareerSelector'
import { ComparisonTable } from '@/components/features/careers/ComparisonTable'
import { Career } from '@/types/career'

export default function ComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialIds = useMemo(() => searchParams.get('ids')?.split(',').filter(Boolean) || [], [searchParams])

  const [selectedCareers, setSelectedCareers] = useState<(Career | null)[]>([null, null, null])

  const { data: careersData, isLoading: careersLoading } = useCareers({
    page: 1,
    limit: 50,
    sort: 'title_asc',
  })
  const allCareers = useMemo(() => careersData?.careers || [], [careersData])

  const selectedIds = selectedCareers
    .filter((career): career is Career => career !== null)
    .map((career) => career.id)

  const { data: comparisonCareers, isLoading: comparisonLoading } = useCareerComparison(selectedIds)

  useEffect(() => {
    if (initialIds.length > 0 && allCareers.length > 0) {
      const preSelected = initialIds.map((id) => allCareers.find((career) => career.id === id) || null)
      setSelectedCareers((prev) => {
        const hasAny = prev.some((career) => career !== null)
        if (hasAny) return prev
        return [preSelected[0] || null, preSelected[1] || null, preSelected[2] || null]
      })
    }
  }, [allCareers, initialIds])

  useEffect(() => {
    const ids = selectedCareers.filter(Boolean).map((career) => career!.id)
    if (ids.length > 0) {
      router.replace(`/student/careers/compare?ids=${ids.join(',')}`, { scroll: false })
    }
  }, [selectedCareers, router])

  const handleSelect = (index: number, career: Career) => {
    setSelectedCareers((prev) => {
      const updated = [...prev]
      updated[index] = career
      return updated
    })
  }

  const handleRemove = (index: number) => {
    setSelectedCareers((prev) => {
      const updated = [...prev]
      updated[index] = null
      return updated
    })
  }

  const excludeIds = selectedCareers
    .filter((career): career is Career => career !== null)
    .map((career) => career.id)

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold text-charcoal dark:text-dark-text">Compare Careers</h1>
        <p className="text-slate dark:text-gray-400 mt-2">
          See how different careers stack up against each other
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((index) => (
          <CareerSelector
            key={index}
            careers={allCareers}
            selectedCareer={selectedCareers[index]}
            onSelect={(career) => handleSelect(index, career)}
            onRemove={() => handleRemove(index)}
            excludeIds={excludeIds.filter((id) => id !== selectedCareers[index]?.id)}
            isLoading={careersLoading}
          />
        ))}
      </div>

      <div className="mt-10">
        {selectedIds.length < 2 ? (
          <div
            className="text-center py-16 bg-brand-cream/50 dark:bg-dark-surface
            rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-border"
          >
            <ArrowLeftRight size={40} className="mx-auto text-muted mb-4" />
            <p className="text-muted text-base">
              {selectedIds.length === 1
                ? 'Select another career to compare with'
                : 'Select at least 2 careers to compare'}
            </p>
          </div>
        ) : comparisonLoading ? (
          <div className="text-center py-16">
            <div
              className="animate-spin w-8 h-8 border-2 border-brand-forest
              border-t-transparent rounded-full mx-auto"
            />
            <p className="text-muted mt-4">Loading comparison...</p>
          </div>
        ) : comparisonCareers && comparisonCareers.length >= 2 ? (
          <ComparisonTable careers={comparisonCareers} />
        ) : (
          <div className="text-center py-16 text-muted">
            Failed to load comparison data. Please try again.
          </div>
        )}
      </div>

      <div className="text-center mt-12 mb-8">
        <p className="text-muted mb-4">Not sure which to pick? Let our AI help.</p>
        <Link
          href="/student/assessments"
          className="inline-flex items-center gap-2 bg-brand-terracotta
            hover:bg-brand-terracotta/90 text-white font-semibold
            px-6 py-3 rounded-xl transition-colors"
        >
          Take Assessment
        </Link>
      </div>
    </div>
  )
}
