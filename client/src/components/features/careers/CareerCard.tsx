import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { Career } from '@/types/career'
import { cn } from '@/lib/utils'
import { formatSalary } from '@/lib/format-salary'

interface CareerCardProps {
  career: Career
  variant?: 'grid' | 'list' | 'compact'
  isSaved?: boolean
  onSaveToggle?: (careerId: string) => void
  showCompareCheckbox?: boolean
  isSelectedForCompare?: boolean
  onCompareToggle?: (careerId: string) => void
}

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace('#', '')
  const bigint = parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    'Technology & IT': '#1B4332',
    'Healthcare & Medicine': '#E63946',
    Engineering: '#457B9D',
    'Business & Finance': '#D4A373',
    'Creative Arts & Design': '#9B5DE5',
    'Law & Governance': '#6D6875',
    'Science & Research': '#06D6A0',
    'Education & Social Work': '#E76F51',
  }
  return map[category] || '#1B4332'
}

function growthStyle(growth: string | null) {
  const value = (growth || '').toLowerCase()
  if (value.includes('high')) return { label: '↑ High Growth', className: 'bg-status-success/10 text-status-success' }
  if (value.includes('moderate')) return { label: '→ Moderate', className: 'bg-status-warning/20 text-charcoal dark:text-status-warning' }
  if (value.includes('stable')) return { label: '— Stable', className: 'bg-status-info/10 text-status-info' }
  return { label: '✦ Emerging', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' }
}

export function CareerCard({
  career,
  variant = 'grid',
  isSaved,
  onSaveToggle,
  showCompareCheckbox,
  isSelectedForCompare,
  onCompareToggle,
}: CareerCardProps) {
  const categoryColor = getCategoryColor(career.category)
  const growth = growthStyle(career.growthOutlook)
  const salaryText = formatSalary(career.averageSalary)

  const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onSaveToggle?.(career.id)
  }

  if (variant === 'compact') {
    return (
      <Link href={`/student/careers/${career.id}`}>
        <div className="rounded-lg border border-gray-100 bg-white p-3 transition hover:shadow-card dark:border-dark-border dark:bg-dark-surface">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: categoryColor }}>
            {career.category}
          </p>
          <h4 className="mt-1 truncate font-heading font-semibold text-charcoal dark:text-dark-text">{career.title}</h4>
          <p className="mt-1 text-sm font-mono text-slate dark:text-dark-muted">{salaryText}</p>
        </div>
      </Link>
    )
  }

  if (variant === 'list') {
    return (
      <div className="relative">
        {showCompareCheckbox && (
          <div
            className="absolute top-3 right-3 z-20"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <label
              className="flex items-center gap-1.5 cursor-pointer
                bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm
                rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200
                dark:border-dark-border hover:border-brand-sage transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelectedForCompare || false}
                onChange={(e) => {
                  e.stopPropagation()
                  onCompareToggle?.(career.id)
                }}
                className="w-3.5 h-3.5 rounded border-gray-300
                  text-brand-forest focus:ring-brand-forest/50 cursor-pointer"
              />
              <span
                className="text-xs font-medium text-slate dark:text-gray-400
                  select-none"
              >
                Compare
              </span>
            </label>
          </div>
        )}

        <button
          onClick={handleSaveClick}
          className="absolute bottom-3 right-3 z-20 rounded-full p-2 text-muted hover:text-brand-terracotta"
          aria-label={isSaved ? 'Remove from saved' : 'Save career'}
        >
          <Bookmark size={18} className={isSaved ? 'fill-brand-terracotta text-brand-terracotta' : ''} />
        </button>

        <Link href={`/student/careers/${career.id}`} className="block">
          <motion.article
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="relative flex min-h-[120px] flex-row gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 pr-14 transition-all duration-300 hover:shadow-card-hover dark:border-dark-border dark:bg-dark-surface"
          >
          <div className="w-1 rounded-full" style={{ backgroundColor: categoryColor }} />
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: categoryColor }}>{career.category}</p>
            <h3 className="mt-1 text-lg font-semibold text-charcoal dark:text-dark-text">{career.title}</h3>
            <p className="mt-1 line-clamp-3 text-sm text-slate dark:text-gray-400">{career.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {career.skills.slice(0, 5).map((skill) => (
                <span key={skill} className="rounded-full bg-brand-mint/20 px-2 py-0.5 text-xs text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted dark:text-dark-muted">
              <span className="font-mono">{salaryText}</span>
              <span className={cn('rounded-full px-2 py-0.5', growth.className)}>{growth.label}</span>
              <span>{career.popularExams.slice(0, 2).join(', ') || 'No exam data'}</span>
            </div>
          </div>
          </motion.article>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative group">
      {showCompareCheckbox && (
        <div
          className="absolute top-3 right-3 z-20"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <label
            className="flex items-center gap-1.5 cursor-pointer
              bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm
              rounded-lg px-2.5 py-1.5 shadow-sm border border-gray-200
              dark:border-dark-border hover:border-brand-sage transition-colors"
          >
            <input
              type="checkbox"
              checked={isSelectedForCompare || false}
              onChange={(e) => {
                e.stopPropagation()
                onCompareToggle?.(career.id)
              }}
              className="w-3.5 h-3.5 rounded border-gray-300
                text-brand-forest focus:ring-brand-forest/50 cursor-pointer"
            />
            <span
              className="text-xs font-medium text-slate dark:text-gray-400
                select-none"
            >
              Compare
            </span>
          </label>
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onSaveToggle?.(career.id)
        }}
        className="absolute bottom-4 right-4 z-20 p-1.5 rounded-lg hover:bg-brand-terracotta/10 transition-colors"
        aria-label={isSaved ? 'Remove from saved' : 'Save career'}
      >
        <Bookmark
          size={18}
          className={cn(
            'transition-colors',
            isSaved
              ? 'fill-brand-terracotta text-brand-terracotta'
              : 'text-muted hover:text-brand-terracotta'
          )}
        />
      </button>

      <Link href={`/student/careers/${career.id}`} className="block">
        <motion.article
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-dark-border dark:bg-dark-surface"
        >
        <div className="h-[3px] w-full" style={{ backgroundColor: categoryColor }} />

        <div className="p-5">
          <span
            className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide"
            style={{ color: categoryColor, backgroundColor: hexToRgba(categoryColor, 0.14) }}
          >
            {career.category}
          </span>

          <h3 className="mt-2 truncate text-lg font-semibold font-heading text-charcoal dark:text-dark-text">{career.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate dark:text-gray-400">{career.description}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {career.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-full bg-brand-mint/20 px-2 py-0.5 text-xs text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint">
                {skill}
              </span>
            ))}
            {career.skills.length > 3 ? (
              <span className="rounded-full bg-border px-2 py-0.5 text-xs text-muted dark:bg-dark-border dark:text-dark-muted">
                +{career.skills.length - 3} more
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 pr-10 dark:border-dark-border">
            <span className="font-mono text-sm font-medium text-slate dark:text-dark-text">{salaryText}</span>
            <span className={cn('rounded-full px-2 py-1 text-xs', growth.className)}>{growth.label}</span>
          </div>
        </div>
        </motion.article>
      </Link>
    </div>
  )
}
