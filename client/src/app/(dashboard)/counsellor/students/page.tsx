'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Search, Users } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useCounsellorStudents } from '@/hooks/useCounsellor'
import { CounsellorStudent } from '@/types/counsellor'

function StudentCard({ student }: { student: CounsellorStudent }) {
    const initials = `${student.firstName[0] || ''}${student.lastName[0] || ''}`.toUpperCase()

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-dark-border dark:bg-dark-surface">
            <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sage text-sm font-semibold text-white">
                    {initials}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-charcoal dark:text-dark-text">
                        {student.firstName} {student.lastName}
                    </p>
                    <p className="truncate text-xs text-muted dark:text-dark-muted">{student.email}</p>
                </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate dark:text-dark-muted">
                <p>School: {student.studentProfile?.school || '—'}</p>
                <p>City: {student.studentProfile?.city || '—'}</p>
            </div>

            {student.studentProfile?.stream ? (
                <span className="mt-3 inline-flex rounded-full bg-brand-cream px-2.5 py-1 text-xs font-medium text-brand-forest dark:bg-dark-elevated dark:text-brand-mint">
                    {student.studentProfile.stream.replace(/_/g, ' ')}
                </span>
            ) : null}

            <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-muted dark:border-dark-border dark:text-dark-muted">
                <p>{student.totalSessions} sessions</p>
                <p className="mt-1">Last: {format(new Date(student.lastSessionDate), 'dd MMM yyyy')}</p>
                <span className="mt-2 inline-flex rounded-full bg-brand-sage/15 px-2 py-0.5 text-[11px] font-medium text-brand-forest dark:text-brand-mint">
                    {student.lastStatus}
                </span>
            </div>

            <button
                type="button"
                className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-charcoal transition-colors hover:bg-brand-cream dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-elevated"
            >
                View Details
            </button>
        </div>
    )
}

export default function CounsellorStudentsPage() {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 250)
    const { data: students = [], isLoading } = useCounsellorStudents()

    const filteredStudents = useMemo(() => {
        if (!debouncedSearch.trim()) return students
        const term = debouncedSearch.toLowerCase().trim()
        return students.filter((student: CounsellorStudent) => {
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
            return fullName.includes(term)
        })
    }, [students, debouncedSearch])

    return (
        <div>
            <h1 className="font-heading text-3xl font-bold text-charcoal dark:text-dark-text">My Students</h1>
            <p className="mt-1 text-muted dark:text-dark-muted">Students you've mentored</p>

            <div className="relative mt-6 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by student name"
                    className="h-11 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm text-charcoal outline-none transition-all focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                />
            </div>

            {isLoading ? (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="h-52 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-elevated" />
                    ))}
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-border bg-brand-ivory px-6 py-12 text-center dark:border-dark-border dark:bg-dark-surface">
                    <Users className="mx-auto mb-3 h-8 w-8 text-brand-forest dark:text-brand-mint" />
                    <p className="text-sm text-muted dark:text-dark-muted">
                        No students yet. Once students book sessions with you, they'll appear here.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredStudents.map((student: CounsellorStudent) => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </div>
            )}
        </div>
    )
}
