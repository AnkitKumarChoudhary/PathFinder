'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { MentorFilters as MentorFiltersType } from '@/types/mentorship'

interface MentorFiltersProps {
  value: Partial<MentorFiltersType>
  onChange: (next: Partial<MentorFiltersType>) => void
  onReset: () => void
}

const SPECIALIZATIONS = [
  'Career Counselling',
  'Engineering Careers',
  'Arts & Humanities',
  'UPSC Preparation',
  'Higher Education Abroad',
]

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Malayalam', 'Kannada']

export function MentorFilters({ value, onChange, onReset }: MentorFiltersProps) {
  const selectedSpecializations = value.specialization || []
  const selectedLanguages = value.language || []

  const toggleSelection = (list: string[], item: string) =>
    list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item]

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
      <div className="grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Search mentors"
          value={value.search || ''}
          onChange={(event) => onChange({ ...value, search: event.target.value, page: 1 })}
          leftIcon={<Search className="h-4 w-4" />}
        />

        <Select
          value={value.sort || 'rating_desc'}
          onChange={(event) => onChange({ ...value, sort: event.target.value as MentorFiltersType['sort'], page: 1 })}
        >
          <option value="rating_desc">Top Rated</option>
          <option value="rating_asc">Rating (Low to High)</option>
          <option value="experience_desc">Experience (High to Low)</option>
          <option value="rate_low">Rate (Low to High)</option>
          <option value="rate_high">Rate (High to Low)</option>
        </Select>

        <Select
          value={value.experience || ''}
          onChange={(event) =>
            onChange({
              ...value,
              experience: (event.target.value || undefined) as MentorFiltersType['experience'],
              page: 1,
            })
          }
        >
          <option value="">Any Experience</option>
          <option value="0-2">0-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10+">10+ years</option>
        </Select>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-body-sm font-medium">Specializations</p>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map((item) => (
              <Checkbox
                key={item}
                checked={selectedSpecializations.includes(item)}
                onChange={() =>
                  onChange({ ...value, specialization: toggleSelection(selectedSpecializations, item), page: 1 })
                }
                label={item}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-body-sm font-medium">Languages</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((item) => (
              <Checkbox
                key={item}
                checked={selectedLanguages.includes(item)}
                onChange={() => onChange({ ...value, language: toggleSelection(selectedLanguages, item), page: 1 })}
                label={item}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </section>
  )
}
