'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: { rating: number; feedback: string }) => Promise<void> | void
  loading?: boolean
}

export function RatingModal({ isOpen, onClose, onSubmit, loading = false }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (rating < 1) return

    await onSubmit({ rating, feedback })
    setRating(0)
    setFeedback('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate Your Session" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="mb-2 text-body-sm font-medium">Your Rating</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} className="rounded-md p-1">
                <Star
                  className={`h-6 w-6 ${value <= rating ? 'fill-amber-400 text-amber-500' : 'text-muted dark:text-dark-muted'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Feedback"
          placeholder="Share your experience with this session"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          rows={4}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={rating < 1}>
            Submit Rating
          </Button>
        </div>
      </form>
    </Modal>
  )
}
