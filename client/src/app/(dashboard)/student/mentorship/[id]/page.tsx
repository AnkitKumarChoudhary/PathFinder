'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, BadgeCheck, Languages, Star } from 'lucide-react'
import { useMentor } from '@/hooks/useMentors'
import { BookingModal } from '@/components/features/mentorship/BookingModal'
import { Button } from '@/components/ui/Button'

export default function MentorProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { data: mentor, isLoading } = useMentor(params.id)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-dark-elevated" />
  }

  if (!mentor) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 dark:border-dark-border dark:bg-dark-surface">
        <p className="text-body">Mentor profile not found.</p>
        <Link href="/student/mentorship" className="mt-3 inline-block text-body-sm text-brand-forest underline">
          Back to mentors
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <Link href="/student/mentorship" className="inline-flex items-center gap-2 text-body-sm text-brand-forest">
        <ArrowLeft className="h-4 w-4" />
        Back to mentors
      </Link>

      <section className="rounded-2xl border border-border bg-surface p-6 dark:border-dark-border dark:bg-dark-surface">
        <div className="flex flex-col gap-5 md:flex-row md:items-start">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-brand-forest/10">
            {mentor.avatar ? (
              <Image
                src={mentor.avatar}
                alt={`${mentor.firstName} ${mentor.lastName}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-brand-forest">
                {mentor.firstName[0]}
                {mentor.lastName[0]}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-heading-2">
                {mentor.firstName} {mentor.lastName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-mint/20 px-2.5 py-1 text-xs font-medium text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            </div>

            <p className="mt-2 text-body text-muted dark:text-dark-muted">{mentor.bio}</p>

            <div className="mt-4 grid gap-2 text-body-sm md:grid-cols-3">
              <p className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500" /> {mentor.rating.toFixed(1)} rating
              </p>
              <p>{mentor.experience} years experience</p>
              <p>{mentor.totalSessions} sessions completed</p>
            </div>

            <p className="mt-3 inline-flex items-center gap-1.5 text-body-sm text-muted dark:text-dark-muted">
              <Languages className="h-4 w-4" /> {mentor.languages.join(', ')}
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-heading-3 text-brand-terracotta">₹{mentor.hourlyRate || 0}</p>
            <p className="text-body-sm text-muted dark:text-dark-muted">per hour</p>
            <Button className="mt-4" onClick={() => setIsBookingOpen(true)}>
              Book Session
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 dark:border-dark-border dark:bg-dark-surface">
        <h2 className="text-heading-4">Specializations</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {mentor.specializations.map((specialization) => (
            <span
              key={specialization}
              className="rounded-full bg-brand-cream px-3 py-1 text-body-sm text-charcoal dark:bg-dark-elevated dark:text-dark-text"
            >
              {specialization}
            </span>
          ))}
        </div>

        <h2 className="mt-6 text-heading-4">Qualifications</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-body text-muted dark:text-dark-muted">
          {mentor.qualifications.map((qualification) => (
            <li key={qualification}>{qualification}</li>
          ))}
        </ul>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} mentor={mentor} />
    </div>
  )
}
