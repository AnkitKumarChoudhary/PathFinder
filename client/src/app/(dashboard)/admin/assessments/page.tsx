'use client'

import { ClipboardList } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAdminAssessments } from '@/hooks/useAdmin'
import { AdminAssessment } from '@/types/admin'

function typeVariant(type: string) {
    if (type === 'APTITUDE') return 'mint'
    if (type === 'PERSONALITY_BIG_FIVE') return 'terracotta'
    if (type === 'INTEREST_RIASEC') return 'forest'
    return 'gray'
}

export default function AdminAssessmentsPage() {
    const { data, isLoading } = useAdminAssessments()
    const assessments: AdminAssessment[] = data?.assessments || []

    return (
        <div>
            <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">Assessments</h1>
            <p className="text-slate dark:text-dark-muted">View and manage platform assessments</p>

            {isLoading ? (
                <div className="mt-8 rounded-xl border border-border bg-white p-8 text-center text-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
                    Loading assessments...
                </div>
            ) : assessments.length === 0 ? (
                <div className="mt-8">
                    <EmptyState icon={ClipboardList} title="No assessments found" description="Assessments will appear here once available." />
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {assessments.map((assessment) => (
                        <div key={assessment.id} className="rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
                            <div className="flex items-center justify-between">
                                <Badge size="sm" variant={typeVariant(assessment.type) as any}>
                                    {assessment.type}
                                </Badge>
                                <span className={assessment.isActive ? 'h-2 w-2 rounded-full bg-status-success' : 'h-2 w-2 rounded-full bg-muted'} />
                            </div>

                            <h3 className="mt-3 font-heading text-heading-4 font-semibold text-charcoal dark:text-dark-text">{assessment.title}</h3>
                            <p className="mt-1 line-clamp-2 text-sm text-muted dark:text-dark-muted">{assessment.description}</p>

                            <div className="mt-4 flex items-center gap-4 text-sm text-slate dark:text-dark-muted">
                                <span>{assessment._count.questions} questions</span>
                                {assessment.duration ? <span>{assessment.duration} min</span> : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
