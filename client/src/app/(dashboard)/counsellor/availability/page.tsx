'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateMyAvailability } from '@/lib/mentorship-api'
import { useCounsellorProfile } from '@/hooks/useCounsellor'
import type { TimeSlot } from '@/types/mentorship'

type WeeklySlots = Record<string, TimeSlot[]>

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const emptyWeek = (): WeeklySlots => ({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
})

const normalizeSlots = (value: unknown): TimeSlot[] => {
    if (!Array.isArray(value)) return []
    return value
        .filter((slot) => Boolean(slot) && typeof slot === 'object')
        .map((slot) => {
            const candidate = slot as { start?: string; end?: string }
            return {
                start: candidate.start || '09:00',
                end: candidate.end || '10:00',
            }
        })
}

function DayAvailability({
    day,
    slots,
    onChange,
}: {
    day: string
    slots: TimeSlot[]
    onChange: (slots: TimeSlot[]) => void
}) {
    const addSlot = () => onChange([...(slots || []), { start: '09:00', end: '10:00' }])

    const updateSlot = (index: number, field: 'start' | 'end', value: string) => {
        const next = [...slots]
        next[index] = { ...next[index], [field]: value }
        onChange(next)
    }

    const removeSlot = (index: number) => {
        onChange(slots.filter((_, slotIndex) => slotIndex !== index))
    }

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-dark-border dark:bg-dark-surface">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold capitalize text-charcoal dark:text-dark-text">{day}</span>
                    {slots.length > 0 ? <span className="text-xs text-brand-sage">{slots.length} slot(s)</span> : null}
                </div>

                <button
                    type="button"
                    onClick={addSlot}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-sage transition-colors hover:bg-brand-cream dark:hover:bg-dark-elevated"
                >
                    <Plus size={14} />
                    Add Slot
                </button>
            </div>

            {slots.length === 0 ? (
                <p className="mt-3 text-sm text-muted dark:text-dark-muted">No availability set — you're off this day</p>
            ) : (
                <div className="mt-3 space-y-2">
                    {slots.map((slot, index) => (
                        <div key={`${day}-${index}`} className="flex items-center gap-3">
                            <input
                                type="time"
                                value={slot.start}
                                onChange={(event) => updateSlot(index, 'start', event.target.value)}
                                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-charcoal outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                            />
                            <span className="text-muted dark:text-dark-muted">to</span>
                            <input
                                type="time"
                                value={slot.end}
                                onChange={(event) => updateSlot(index, 'end', event.target.value)}
                                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-charcoal outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                            />
                            <button
                                type="button"
                                onClick={() => removeSlot(index)}
                                className="rounded p-1.5 text-muted transition-colors hover:text-red-500"
                                aria-label={`Remove ${day} slot ${index + 1}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CounsellorAvailabilityPage() {
    const queryClient = useQueryClient()
    const { data: profileData, isLoading } = useCounsellorProfile()
    const [availability, setAvailability] = useState<WeeklySlots>(emptyWeek())

    const updateMutation = useMutation({
        mutationFn: (slots: WeeklySlots) => updateMyAvailability({ slots }),
        onSuccess: () => {
            toast.success('Availability updated')
            queryClient.invalidateQueries({ queryKey: ['counsellor-profile'] })
            queryClient.invalidateQueries({ queryKey: ['counsellor-dashboard'] })
        },
        onError: () => toast.error('Failed to update availability'),
    })

    useEffect(() => {
        const source = (profileData as { counsellorProfile?: { availableSlots?: Record<string, unknown> | null } })
            ?.counsellorProfile?.availableSlots

        if (!source || typeof source !== 'object') {
            setAvailability(emptyWeek())
            return
        }

        const parsed = days.reduce((acc, day) => {
            acc[day] = normalizeSlots((source as Record<string, unknown>)[day])
            return acc
        }, {} as WeeklySlots)

        setAvailability(parsed)
    }, [profileData])

    const hasInvalidSlots = useMemo(() => {
        return days.some((day) =>
            (availability[day] || []).some((slot) => {
                if (!slot.start || !slot.end) return true
                return slot.end <= slot.start
            })
        )
    }, [availability])

    const handleDayChange = (day: string, newSlots: TimeSlot[]) => {
        setAvailability((prev) => ({ ...prev, [day]: newSlots }))
    }

    const handleSave = async () => {
        if (hasInvalidSlots) {
            toast.error('Each time slot must have an end time later than start time')
            return
        }

        await updateMutation.mutateAsync(availability)
    }

    return (
        <div>
            <h1 className="font-heading text-3xl font-bold text-charcoal dark:text-dark-text">Set Your Availability</h1>
            <p className="mt-1 text-muted dark:text-dark-muted">
                Configure your weekly schedule so students can book sessions
            </p>

            {isLoading ? (
                <div className="mt-8 space-y-4">
                    {days.map((day) => (
                        <div key={day} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-elevated" />
                    ))}
                </div>
            ) : (
                <>
                    <div className="mt-8 space-y-4">
                        {days.map((day) => (
                            <DayAvailability
                                key={day}
                                day={day}
                                slots={availability[day] || []}
                                onChange={(newSlots) => handleDayChange(day, newSlots)}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-terracotta px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta/90 disabled:opacity-60"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving...
                            </>
                        ) : (
                            'Save Availability'
                        )}
                    </button>
                </>
            )}
        </div>
    )
}
