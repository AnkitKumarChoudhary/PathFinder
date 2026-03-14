'use client'

import { useState } from 'react'
import { CalendarClock, Video, XCircle, Star } from 'lucide-react'
import { format } from 'date-fns'
import { Appointment, UpdateAppointmentPayload } from '@/types/mentorship'
import { Button } from '@/components/ui/Button'

interface AppointmentCardProps {
  appointment: Appointment
  userRole?: 'STUDENT' | 'COUNSELLOR'
  onStatusUpdate?: (appointmentId: string, payload: UpdateAppointmentPayload) => Promise<void> | void
  onCancel?: (appointment: Appointment) => void
  onRate?: (appointment: Appointment) => void
}

const statusStyles: Record<string, string> = {
  CONFIRMED: 'bg-status-success/10 text-status-success border-status-success/40',
  PENDING: 'bg-status-warning/10 text-status-warning border-status-warning/40',
  COMPLETED: 'bg-status-info/10 text-status-info border-status-info/40',
  CANCELLED: 'bg-status-error/10 text-status-error border-status-error/40',
  RESCHEDULED: 'bg-brand-sand/20 text-brand-terracotta border-brand-sand/60',
  NO_SHOW: 'bg-status-error/10 text-status-error border-status-error/40',
}

function canJoinMeeting(scheduledAt: string) {
  const start = new Date(scheduledAt).getTime() - 15 * 60 * 1000
  const end = new Date(scheduledAt).getTime() + 60 * 60 * 1000
  const now = Date.now()
  return now >= start && now <= end
}

export function AppointmentCard({
  appointment,
  userRole = 'STUDENT',
  onStatusUpdate,
  onCancel,
  onRate,
}: AppointmentCardProps) {
  const [showMeetingLinkInput, setShowMeetingLinkInput] = useState(false)
  const [showNotesInput, setShowNotesInput] = useState(false)
  const [meetingLink, setMeetingLink] = useState(appointment.meetingLink || '')
  const [notes, setNotes] = useState(appointment.counsellorNotes || '')

  const partner = appointment.counsellor || appointment.student
  const isJoinable = appointment.status === 'CONFIRMED' && canJoinMeeting(appointment.scheduledAt)

  const handleConfirm = async () => {
    await onStatusUpdate?.(appointment.id, { status: 'CONFIRMED' })
  }

  const handleDecline = async () => {
    const cancelReason = window.prompt('Enter decline reason', 'Counsellor unavailable') || 'Counsellor unavailable'
    await onStatusUpdate?.(appointment.id, { status: 'CANCELLED', cancelReason })
  }

  const handleMarkComplete = async () => {
    await onStatusUpdate?.(appointment.id, { status: 'COMPLETED' })
  }

  const handleSaveMeetingLink = async () => {
    if (!meetingLink.trim()) return
    await onStatusUpdate?.(appointment.id, { meetingLink: meetingLink.trim() })
    setShowMeetingLinkInput(false)
  }

  const handleSaveNotes = async () => {
    await onStatusUpdate?.(appointment.id, { counsellorNotes: notes })
    setShowNotesInput(false)
  }

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="space-y-2">
          <h3 className="text-heading-4">
            Session with {partner?.firstName} {partner?.lastName}
          </h3>

          <div className="flex items-center gap-2 text-body-sm text-muted dark:text-dark-muted">
            <CalendarClock className="h-4 w-4 text-brand-forest" />
            <span>{format(new Date(appointment.scheduledAt), "EEE, dd MMM yyyy 'at' hh:mm a")}</span>
          </div>

          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
              statusStyles[appointment.status] || statusStyles.PENDING
            }`}
          >
            {appointment.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {userRole === 'STUDENT' && (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
            <Button variant="ghost" size="sm" onClick={() => onCancel?.(appointment)} leftIcon={<XCircle className="h-4 w-4" />}>
              Cancel
            </Button>
          )}

          {userRole === 'COUNSELLOR' && appointment.status === 'PENDING' ? (
            <>
              <Button size="sm" variant="secondary" onClick={handleConfirm}>
                Confirm
              </Button>
              <Button size="sm" variant="outline" onClick={handleDecline}>
                Decline
              </Button>
            </>
          ) : null}

          {userRole === 'COUNSELLOR' && appointment.status === 'CONFIRMED' ? (
            <>
              <Button size="sm" variant="secondary" onClick={handleMarkComplete}>
                Mark Complete
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowMeetingLinkInput((prev) => !prev)}>
                Add Meeting Link
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowNotesInput((prev) => !prev)}>
                Add Notes
              </Button>
            </>
          ) : null}

          {isJoinable && appointment.meetingLink ? (
            <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" leftIcon={<Video className="h-4 w-4" />}>
                Join Meeting
              </Button>
            </a>
          ) : null}

          {appointment.status === 'COMPLETED' && !appointment.rating ? (
            <Button variant="outline" size="sm" leftIcon={<Star className="h-4 w-4" />} onClick={() => onRate?.(appointment)}>
              Rate Session
            </Button>
          ) : null}
        </div>
      </div>

      {userRole === 'COUNSELLOR' && showMeetingLinkInput ? (
        <div className="mt-4 rounded-lg bg-brand-cream/50 p-3 dark:bg-dark-elevated">
          <p className="mb-2 text-xs font-medium text-charcoal dark:text-dark-text">Meeting Link</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              value={meetingLink}
              onChange={(event) => setMeetingLink(event.target.value)}
              placeholder="https://meet.google.com/..."
              className="h-10 flex-1 rounded-lg border border-border bg-white px-3 text-sm text-charcoal outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
            />
            <Button size="sm" onClick={handleSaveMeetingLink}>
              Save
            </Button>
          </div>
        </div>
      ) : null}

      {userRole === 'COUNSELLOR' && showNotesInput ? (
        <div className="mt-4 rounded-lg bg-brand-cream/50 p-3 dark:bg-dark-elevated">
          <p className="mb-2 text-xs font-medium text-charcoal dark:text-dark-text">Session Notes</p>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Add notes for this session"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
          />
          <div className="mt-2 flex justify-end">
            <Button size="sm" onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </div>
        </div>
      ) : null}

      {appointment.feedback ? (
        <p className="mt-3 rounded-lg bg-brand-cream/60 p-3 text-body-sm text-charcoal dark:bg-dark-elevated dark:text-dark-text">
          {appointment.feedback}
        </p>
      ) : null}
    </article>
  )
}
