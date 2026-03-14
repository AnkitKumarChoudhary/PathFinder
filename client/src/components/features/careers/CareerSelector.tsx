'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Career } from '@/types/career'
import { formatSalary } from '@/lib/format-salary'

interface CareerSelectorProps {
  careers: Career[]
  selectedCareer?: Career | null
  onSelect: (career: Career) => void
  onRemove: () => void
  excludeIds?: string[]
  placeholder?: string
  isLoading?: boolean
}

export default function CareerSelector({
  careers,
  selectedCareer,
  onSelect,
  onRemove,
  excludeIds = [],
  placeholder = 'Search by title...',
  isLoading = false,
}: CareerSelectorProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCareers = careers.filter((career) => {
    if (excludeIds.includes(career.id)) return false
    if (!query.trim()) return true
    const lowerQuery = query.toLowerCase()
    return (
      career.title.toLowerCase().includes(lowerQuery) ||
      career.category.toLowerCase().includes(lowerQuery) ||
      career.skills.some((skill) => skill.toLowerCase().includes(lowerQuery))
    )
  })

  if (selectedCareer) {
    return (
      <div
        className="relative border-2 border-brand-sage/30 bg-brand-mint/5
        dark:bg-dark-surface dark:border-brand-sage/20 rounded-xl p-4
        transition-colors"
      >
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-red-50
            dark:hover:bg-red-900/20 text-muted hover:text-red-500 transition-colors"
          aria-label="Remove career"
        >
          <X size={16} />
        </button>
        <p
          className="text-xs font-medium text-brand-sage dark:text-brand-mint
          uppercase tracking-wide"
        >
          {selectedCareer.category}
        </p>
        <h3
          className="font-sora font-semibold text-charcoal dark:text-dark-text
          mt-1 pr-8"
        >
          {selectedCareer.title}
        </h3>
        <p className="text-xs text-muted mt-1">{formatSalary(selectedCareer.averageSalary)}</p>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className="border-2 border-dashed border-gray-300 dark:border-dark-border
        rounded-xl p-4 hover:border-brand-sage/50 dark:hover:border-brand-sage/30
        transition-colors"
      >
        <p className="text-sm font-medium text-charcoal dark:text-dark-text mb-2">Select a career</p>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-dark-elevated
              border border-gray-200 dark:border-dark-border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-brand-sage/30
              focus:border-brand-sage placeholder:text-muted
              text-charcoal dark:text-dark-text"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setIsOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted
                hover:text-charcoal"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 z-50
          bg-white dark:bg-dark-surface border border-gray-200
          dark:border-dark-border rounded-xl shadow-lg
          max-h-64 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted">Loading careers...</div>
          ) : filteredCareers.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted">
              No careers found{query ? ` for "${query}"` : ''}
            </div>
          ) : (
            <ul>
              {filteredCareers.slice(0, 20).map((career) => (
                <li key={career.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(career)
                      setQuery('')
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-brand-mint/10
                      dark:hover:bg-dark-elevated transition-colors
                      border-b border-gray-50 dark:border-dark-border
                      last:border-b-0"
                  >
                    <p
                      className="text-sm font-medium text-charcoal
                      dark:text-dark-text"
                    >
                      {career.title}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {career.category} · {formatSalary(career.averageSalary)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}