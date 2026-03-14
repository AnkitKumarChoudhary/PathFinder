import { Search, X } from 'lucide-react'

interface CareerSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CareerSearch({
  value,
  onChange,
  placeholder = 'Search careers, skills, or exams...',
}: CareerSearchProps) {
  return (
    <div className="flex w-full items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-brand-sage focus-within:ring-2 focus-within:ring-brand-sage/30 dark:border-dark-border dark:bg-dark-surface">
      <Search className="mr-3 h-5 w-5 text-muted dark:text-dark-muted" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-base text-charcoal outline-none placeholder:text-muted dark:text-dark-text dark:placeholder:text-dark-muted"
      />
      {value ? (
        <button onClick={() => onChange('')} className="ml-3 rounded-full p-1 text-muted hover:bg-border hover:text-charcoal dark:hover:bg-dark-border dark:hover:text-dark-text">
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}
