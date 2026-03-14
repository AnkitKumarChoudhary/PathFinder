'use client'

import { KeyboardEvent, useState } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export function TagInput({ tags, onChange, placeholder, maxTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addTag = () => {
    const next = inputValue.trim()
    if (!next) return
    if (tags.includes(next)) {
      setInputValue('')
      return
    }
    if (maxTags && tags.length >= maxTags) return
    onChange([...tags, next])
    setInputValue('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'Enter' || event.key === ',') && inputValue.trim()) {
      event.preventDefault()
      addTag()
      return
    }

    if (event.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-2.5 focus-within:border-brand-sage focus-within:ring-2 focus-within:ring-brand-sage/30 dark:border-dark-border dark:bg-dark-elevated">
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="flex items-center gap-1 rounded-full bg-brand-mint/20 px-2.5 py-1 text-xs font-medium text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((_, tagIndex) => tagIndex !== index))}
            className="transition-colors hover:text-red-500"
            aria-label={`Remove ${tag}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}

      <input
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="min-w-[100px] flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-muted dark:text-dark-text"
      />
    </div>
  )
}
