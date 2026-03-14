'use client'

import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useBookAppointment } from '@/hooks/useAppointments'
import { useMentorAvailability } from '@/hooks/useMentors'
import { Mentor } from '@/types/mentorship'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  mentor: Mentor | null
}

const BOOKING_TYPES = [
  { label: 'General Mentorship', value: 'general' },
  { label: 'Career Planning', value: 'career-planning' },
  { label: 'Exam Strategy', value: 'exam-strategy' },
  { label: 'Study Abroad Guidance', value: 'study-abroad' },
  { label: 'Skill Development', value: 'skill-development' },
] as const

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

export function BookingModal({ isOpen, onClose, mentor }: BookingModalProps) {
  const [date, setDate] = useState(todayDate())
  const [slot, setSlot] = useState<{ start: string; end: string } | null>(null)
  const [type, setType] = useState<(typeof BOOKING_TYPES)[number]['value']>('general')
  const [studentNotes, setStudentNotes] = useState('')

  const bookAppointment = useBookAppointment()
  const { data: availability, isLoading } = useMentorAvailability(mentor?.id || '', date)

  useEffect(() => {
    if (!isOpen) return
    setSlot(null)
  }, [date, isOpen])

  const availableSlots = useMemo(() => availability?.availableSlots || [], [availability])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!mentor || !slot) return

    await bookAppointment.mutateAsync({
      counsellorId: mentor.id,
      date,
      startTime: slot.start,
      endTime: slot.end,
      type,
      studentNotes,
    })

    onClose()
    setStudentNotes('')
    setType('general')
    setSlot(null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mentor ? `Book Session with ${mentor.firstName} ${mentor.lastName}` : 'Book Session'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-body-sm font-medium">Date</label>
            <input
              type="date"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 dark:border-dark-border dark:bg-dark-surface"
              value={date}
              min={todayDate()}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>

          <Select label="Session Type" value={type} onChange={(event) => setType(event.target.value as typeof type)}>
            {BOOKING_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <p className="mb-2 text-body-sm font-medium">
            Available Slots {availability ? `(${format(new Date(`${date}T00:00:00`), 'EEE, dd MMM')})` : ''}
          </p>
          <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-border p-3 dark:border-dark-border">
            {isLoading ? <p className="text-body-sm text-muted">Loading slots...</p> : null}

            {!isLoading && availableSlots.length === 0 ? (
              <p className="col-span-2 text-body-sm text-muted dark:text-dark-muted">No slots available on this date.</p>
            ) : null}

            {availableSlots.map((timeSlot) => {
              const active = slot?.start === timeSlot.start && slot?.end === timeSlot.end
              return (
                <button
                  key={`${timeSlot.start}-${timeSlot.end}`}
                  type="button"
                  onClick={() => setSlot(timeSlot)}
                  className={`rounded-lg border px-3 py-2 text-body-sm font-medium transition ${
                    active
                      ? 'border-brand-forest bg-brand-forest text-white'
                      : 'border-border text-charcoal hover:border-brand-forest/40 dark:border-dark-border dark:text-dark-text'
                  }`}
                >
                  {timeSlot.start} - {timeSlot.end}
                </button>
              )
            })}
          </div>
        </div>

        <Textarea
          label="Notes for Mentor"
          placeholder="Mention your goals or specific questions"
          value={studentNotes}
          onChange={(event) => setStudentNotes(event.target.value)}
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={bookAppointment.isPending} disabled={!slot || !mentor}>
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  )
}
