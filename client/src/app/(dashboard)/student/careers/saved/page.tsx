'use client'

import Link from 'next/link'
import { useState } from 'react'
import { format } from 'date-fns'
import { BookmarkX } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CareerCard } from '@/components/features/careers/CareerCard'
import { CareerCardSkeleton } from '@/components/features/careers/CareerCardSkeleton'
import { useSavedCareers, useToggleSaveCareer, useUpdateCareerNote } from '@/hooks/useSavedCareers'

export default function SavedCareersPage() {
  const { data: savedCareers = [], isLoading } = useSavedCareers()
  const toggleSave = useToggleSaveCareer()
  const updateNote = useUpdateCareerNote()

  const [isEditingNote, setIsEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  const startEditingNote = (saved: (typeof savedCareers)[number]) => {
    setIsEditingNote(saved.careerId)
    setNoteText(saved.notes || '')
  }

  const saveNote = async (careerId: string) => {
    await updateNote.mutateAsync({ careerId, notes: noteText })
    setIsEditingNote(null)
    setNoteText('')
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold">Saved Careers</h1>
          <p className="text-slate dark:text-gray-400">Careers you&apos;ve bookmarked for later</p>
        </div>
        <Badge variant="forest">{savedCareers.length} saved</Badge>
      </div>

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CareerCardSkeleton key={index} />
          ))}
        </div>
      ) : savedCareers.length === 0 ? (
        <div className="py-20 text-center">
          <BookmarkX className="mx-auto h-12 w-12 text-muted dark:text-dark-muted" />
          <h3 className="mt-4 font-heading text-heading-3">No saved careers yet</h3>
          <p className="mt-2 text-slate dark:text-gray-400">Start exploring and save careers that interest you</p>
          <Link href="/student/careers">
            <Button className="mt-4">Browse Careers</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {savedCareers.map((saved) => (
            <div key={saved.id}>
              <CareerCard
                career={saved.career}
                variant="grid"
                isSaved
                onSaveToggle={() => toggleSave.mutate(saved.careerId)}
              />

              <p className="mt-2 text-xs text-muted dark:text-dark-muted">
                Saved on {format(new Date(saved.savedAt), 'dd MMM yyyy')}
              </p>

              <div className="mt-2">
                {isEditingNote === saved.careerId ? (
                  <div>
                    <textarea
                      rows={2}
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm dark:border-dark-border dark:bg-dark-surface"
                      value={noteText}
                      onChange={(event) => setNoteText(event.target.value)}
                      maxLength={500}
                      placeholder="Why did you save this career?"
                    />
                    <div className="mt-1 flex gap-2">
                      <button className="rounded bg-brand-forest px-2 py-1 text-xs text-white" onClick={() => saveNote(saved.careerId)}>
                        Save Note
                      </button>
                      <button className="text-xs text-muted" onClick={() => setIsEditingNote(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => startEditingNote(saved)} className="text-xs text-brand-sage hover:underline">
                    {saved.notes ? '✏️ Edit Note' : '+ Add Note'}
                  </button>
                )}

                {saved.notes && isEditingNote !== saved.careerId ? (
                  <p className="mt-1 text-xs italic text-slate dark:text-gray-300">&quot;{saved.notes}&quot;</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
