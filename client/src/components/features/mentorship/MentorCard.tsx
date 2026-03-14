'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Languages, BriefcaseBusiness } from 'lucide-react'
import { Mentor } from '@/types/mentorship'
import { Button } from '@/components/ui/Button'

interface MentorCardProps {
  mentor: Mentor
  onBookNow?: (mentor: Mentor) => void
}

export function MentorCard({ mentor, onBookNow }: MentorCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-soft dark:border-dark-border dark:bg-dark-surface">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-brand-forest/15">
          {mentor.avatar ? (
            <Image
              src={mentor.avatar}
              alt={`${mentor.firstName} ${mentor.lastName}`}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-semibold text-brand-forest">
              {mentor.firstName[0]}
              {mentor.lastName[0]}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-heading-4">
            {mentor.firstName} {mentor.lastName}
          </h3>
          <p className="mt-1 line-clamp-2 text-body-sm text-muted dark:text-dark-muted">{mentor.bio || 'Career mentorship expert'}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {mentor.specializations.slice(0, 3).map((specialization) => (
          <span
            key={specialization}
            className="rounded-full bg-brand-mint/20 px-2.5 py-1 text-xs font-medium text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint"
          >
            {specialization}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-body-sm text-charcoal dark:text-dark-text">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-amber-500" />
          <span>{mentor.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BriefcaseBusiness className="h-4 w-4 text-brand-forest" />
          <span>{mentor.experience} yrs</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-muted dark:text-dark-muted">
          <Languages className="h-4 w-4" />
          <span className="line-clamp-1">{mentor.languages.join(', ')}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 dark:border-dark-border">
        <p className="text-body-sm font-semibold text-brand-terracotta">
          ₹{mentor.hourlyRate || 0}
          <span className="font-normal text-muted dark:text-dark-muted"> / hour</span>
        </p>
        <div className="flex items-center gap-2">
          <Link href={`/student/mentorship/${mentor.id}`}>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
          <Button size="sm" onClick={() => onBookNow?.(mentor)}>
            Book
          </Button>
        </div>
      </div>
    </article>
  )
}
