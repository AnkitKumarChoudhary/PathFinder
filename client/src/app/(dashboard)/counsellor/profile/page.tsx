'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { TagInput } from '@/components/features/resume/TagInput'
import { useCounsellorProfile, useUpdateCounsellorProfile } from '@/hooks/useCounsellor'

export default function CounsellorProfilePage() {
    const { data: profileData, isLoading } = useCounsellorProfile()
    const updateProfile = useUpdateCounsellorProfile()

    const [bio, setBio] = useState('')
    const [specializations, setSpecializations] = useState<string[]>([])
    const [qualifications, setQualifications] = useState<string[]>([])
    const [languages, setLanguages] = useState<string[]>([])
    const [hourlyRate, setHourlyRate] = useState<number>(0)

    useEffect(() => {
        const profile = (profileData as { counsellorProfile?: Record<string, unknown> })?.counsellorProfile
        if (!profile) return

        setBio((profile.bio as string) || '')
        setSpecializations(((profile.specializations as string[]) || []).filter(Boolean))
        setQualifications(((profile.qualifications as string[]) || []).filter(Boolean))
        setLanguages(((profile.languages as string[]) || []).filter(Boolean))
        setHourlyRate(typeof profile.hourlyRate === 'number' ? profile.hourlyRate : 0)
    }, [profileData])

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await updateProfile.mutateAsync({
            bio,
            specializations,
            qualifications,
            languages,
            hourlyRate,
        })
    }

    return (
        <div>
            <h1 className="font-heading text-3xl font-bold text-charcoal dark:text-dark-text">Edit Profile</h1>
            <p className="mt-1 text-muted dark:text-dark-muted">Keep your profile updated to attract more students</p>

            {isLoading ? (
                <div className="mt-8 max-w-2xl space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-elevated" />
                    ))}
                </div>
            ) : (
                <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-6">
                    <div>
                        <Textarea
                            label="Bio"
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            rows={5}
                            maxLength={2000}
                            placeholder="Tell students about your background, approach, and expertise..."
                        />
                        <p className="mt-1 text-xs text-muted dark:text-dark-muted">{bio.length}/2000</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-charcoal dark:text-dark-text">Specializations</label>
                        <TagInput
                            tags={specializations}
                            onChange={setSpecializations}
                            placeholder="Add a specialization..."
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-charcoal dark:text-dark-text">Qualifications</label>
                        <TagInput tags={qualifications} onChange={setQualifications} placeholder="Add a qualification..." />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-charcoal dark:text-dark-text">Languages</label>
                        <TagInput tags={languages} onChange={setLanguages} placeholder="Add a language..." />
                    </div>

                    <div>
                        <Input
                            label="Session Rate (₹)"
                            type="number"
                            min={0}
                            step={50}
                            value={hourlyRate}
                            onChange={(event) => setHourlyRate(Number(event.target.value || 0))}
                            placeholder="e.g., 800"
                        />
                        <p className="mt-1 text-xs text-muted dark:text-dark-muted">Set to 0 for free sessions</p>
                    </div>

                    <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-terracotta px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta/90 disabled:opacity-60"
                    >
                        {updateProfile.isPending ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </form>
            )}
        </div>
    )
}
