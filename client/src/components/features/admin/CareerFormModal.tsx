'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Textarea } from '@/components/ui/Textarea'
import { TagInput } from '@/components/features/resume/TagInput'
import { AdminCareer } from '@/types/admin'

interface CareerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void
  career?: AdminCareer | null
}

const categories = [
  'Engineering & Technology',
  'Medical & Healthcare',
  'Business & Finance',
  'Law',
  'Creative & Design',
  'Media & Communication',
  'Government & Defence',
  'Emerging & Non-Traditional',
]

const growthOutlookOptions = ['High', 'Moderate', 'Stable', 'Emerging']

export function CareerFormModal({ isOpen, onClose, onSubmit, career }: CareerFormModalProps) {
  const isEdit = Boolean(career)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Engineering & Technology')
  const [description, setDescription] = useState('')
  const [averageSalary, setAverageSalary] = useState('{"entry": 500000, "mid": 1200000, "senior": 2500000}')
  const [growthOutlook, setGrowthOutlook] = useState('Moderate')
  const [educationPath, setEducationPath] = useState('Any Graduation')
  const [skills, setSkills] = useState<string[]>([])
  const [popularExams, setPopularExams] = useState<string[]>([])
  const [topColleges, setTopColleges] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [dayInLife, setDayInLife] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitLabel = useMemo(() => (isEdit ? 'Update Career' : 'Create Career'), [isEdit])

  useEffect(() => {
    if (!isOpen) return

    if (career) {
      setTitle(career.title || '')
      setCategory(career.category || 'Engineering & Technology')
      setDescription(career.description || '')
      setAverageSalary('{"entry": 500000, "mid": 1200000, "senior": 2500000}')
      setGrowthOutlook('Moderate')
      setEducationPath('Any Graduation')
      setSkills([])
      setPopularExams([])
      setTopColleges([])
      setIndustries([])
      setDayInLife('')
      setIsActive(career.isActive)
      return
    }

    setTitle('')
    setCategory('Engineering & Technology')
    setDescription('')
    setAverageSalary('{"entry": 500000, "mid": 1200000, "senior": 2500000}')
    setGrowthOutlook('Moderate')
    setEducationPath('Any Graduation')
    setSkills([])
    setPopularExams([])
    setTopColleges([])
    setIndustries([])
    setDayInLife('')
    setIsActive(true)
  }, [career, isOpen])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !description.trim() || !category) return

    setIsSubmitting(true)
    try {
      let parsedAverageSalary: unknown = averageSalary
      try {
        parsedAverageSalary = JSON.parse(averageSalary)
      } catch {
        parsedAverageSalary = averageSalary
      }

      await onSubmit({
        title: title.trim(),
        category,
        description: description.trim(),
        averageSalary: parsedAverageSalary,
        growthOutlook,
        educationPath: educationPath.trim(),
        skills,
        popularExams,
        topColleges,
        industries,
        dayInLife: dayInLife.trim() || null,
        isActive,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Career' : 'Create Career'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          <Select label="Category" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <Textarea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} required />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Average Salary (JSON/string)"
            value={averageSalary}
            onChange={(event) => setAverageSalary(event.target.value)}
            placeholder='{"entry": 500000, "mid": 1200000, "senior": 2500000}'
          />
          <Select label="Growth Outlook" value={growthOutlook} onChange={(event) => setGrowthOutlook(event.target.value)}>
            {growthOutlookOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Education Path"
          value={educationPath}
          onChange={(event) => setEducationPath(event.target.value)}
          placeholder="B.Tech in CSE / BCA + MCA"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-body-sm font-medium text-charcoal dark:text-dark-text">Skills</p>
            <TagInput tags={skills} onChange={setSkills} placeholder="Add a skill..." />
          </div>
          <div>
            <p className="mb-2 text-body-sm font-medium text-charcoal dark:text-dark-text">Popular Exams</p>
            <TagInput tags={popularExams} onChange={setPopularExams} placeholder="Add an exam..." />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-body-sm font-medium text-charcoal dark:text-dark-text">Top Colleges</p>
            <TagInput tags={topColleges} onChange={setTopColleges} placeholder="Add a college..." />
          </div>
          <div>
            <p className="mb-2 text-body-sm font-medium text-charcoal dark:text-dark-text">Industries</p>
            <TagInput tags={industries} onChange={setIndustries} placeholder="Add an industry..." />
          </div>
        </div>

        <Textarea
          label="Day in Life"
          value={dayInLife}
          onChange={(event) => setDayInLife(event.target.value)}
          rows={3}
          placeholder="Typical responsibilities and workday"
        />

        <div className="rounded-xl border border-border bg-brand-ivory p-3 dark:border-dark-border dark:bg-dark-elevated">
          <Switch checked={isActive} onCheckedChange={setIsActive} label={isActive ? 'Career is active' : 'Career is inactive'} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting} leftIcon={<Plus className="h-4 w-4" />}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
