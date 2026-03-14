'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
    Calendar,
    CalendarOff,
    CheckCircle,
    Clock,
    Star,
    UserCircle,
    Users,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import { useCounsellorDashboard } from '@/hooks/useCounsellor'
import { useUpdateAppointment } from '@/hooks/useAppointments'

type StatCardProps = {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: number
    colorClass: string
    highlight?: boolean
}

function StatCard({ icon: Icon, label, value, colorClass, highlight }: StatCardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-gray-100 bg-white p-5 dark:border-dark-border dark:bg-dark-surface',
                highlight && 'border-status-warning/40 ring-1 ring-status-warning/20'
            )}
        >
            <div className="mb-3 flex items-center justify-between">
                <span className={cn('rounded-xl p-2.5', colorClass)}>
                    <Icon className="h-4 w-4" />
                </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">{label}</p>
            <p className="mt-1 font-mono text-2xl font-bold text-charcoal dark:text-dark-text">{value}</p>
        </div>
    )
}

function QuickActionCard({
    href,
    title,
    description,
    icon: Icon,
    colorClass,
}: {
    href: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    colorClass: string
}) {
    return (
        <Link
            href={href}
            className="rounded-xl border border-gray-100 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-soft dark:border-dark-border dark:bg-dark-surface"
        >
            <div className={cn('mb-3 inline-flex rounded-xl p-2.5', colorClass)}>
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-base font-semibold text-charcoal dark:text-dark-text">{title}</h3>
            <p className="mt-1 text-sm text-muted dark:text-dark-muted">{description}</p>
        </Link>
    )
}

const statusBadgeClass = (status: string) =>
    cn(
        'rounded-full px-2.5 py-1 text-xs font-medium',
        status === 'PENDING' && 'bg-status-warning/20 text-charcoal dark:text-status-warning',
        status === 'CONFIRMED' && 'bg-status-info/15 text-status-info',
        status === 'COMPLETED' && 'bg-status-success/15 text-status-success',
        status === 'CANCELLED' && 'bg-status-error/15 text-status-error'
    )

export default function CounsellorDashboardPage() {
    const { user } = useAuthStore()
    const { data: stats, isLoading } = useCounsellorDashboard()
    const updateAppointment = useUpdateAppointment()

    const onConfirmPending = async (appointmentId: string) => {
        await updateAppointment.mutateAsync({
            appointmentId,
            payload: { status: 'CONFIRMED' },
        })
    }

    if (isLoading || !stats) {
        return (
            <div className="space-y-4">
                <div className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-dark-elevated" />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-elevated" />
                    ))}
                </div>
            </div>
        )
    }

    const counsellorName = user ? `${user.firstName} ${user.lastName}` : 'Counsellor'

    return (
        <div>
            <div className="mb-8 rounded-2xl bg-gradient-to-br from-brand-forest to-brand-sage p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-white/70">Welcome back,</p>
                        <h1 className="mt-1 font-heading text-2xl font-bold md:text-3xl">{counsellorName}</h1>
                        <p className="mt-2 text-sm text-white/60">
                            You have {stats.pendingCount} pending requests and {stats.thisWeekCount} sessions this week
                        </p>
                    </div>
                    <div className="hidden text-right md:block">
                        <div className="flex items-center gap-2">
                            <Star className="fill-brand-sand text-brand-sand" size={20} />
                            <span className="font-mono text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
                        </div>
                        <p className="mt-1 text-xs text-white/60">from {stats.totalRatings} ratings</p>
                    </div>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                    icon={Calendar}
                    label="Total Sessions"
                    value={stats.totalAppointments}
                    colorClass="bg-brand-forest/15 text-brand-forest dark:bg-brand-forest/25 dark:text-brand-mint"
                />
                <StatCard
                    icon={Clock}
                    label="Pending"
                    value={stats.pendingCount}
                    colorClass="bg-status-warning/20 text-charcoal dark:text-status-warning"
                    highlight={stats.pendingCount > 0}
                />
                <StatCard
                    icon={CheckCircle}
                    label="Completed"
                    value={stats.completedCount}
                    colorClass="bg-status-success/20 text-status-success"
                />
                <StatCard
                    icon={Users}
                    label="Students"
                    value={stats.uniqueStudents}
                    colorClass="bg-brand-sage/20 text-brand-forest dark:text-brand-mint"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white p-6 dark:border-dark-border dark:bg-dark-surface lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="font-heading text-lg font-semibold text-charcoal dark:text-dark-text">Today's Schedule</h2>
                        <Link href="/counsellor/appointments" className="text-sm text-brand-sage hover:underline">
                            View all →
                        </Link>
                    </div>

                    {stats.todayAppointments.length === 0 ? (
                        <div className="py-10 text-center">
                            <CalendarOff size={32} className="mx-auto mb-2 text-muted" />
                            <p className="text-sm text-muted dark:text-dark-muted">No appointments scheduled for today</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.todayAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="flex items-center gap-4 rounded-lg border border-gray-100 bg-brand-cream/30 p-4 dark:border-dark-border dark:bg-dark-elevated"
                                >
                                    <div className="min-w-[60px] text-center">
                                        <p className="font-mono font-semibold text-charcoal dark:text-dark-text">{appointment.startTime}</p>
                                        <p className="text-xs text-muted dark:text-dark-muted">{appointment.endTime}</p>
                                    </div>
                                    <div className="h-10 w-0.5 rounded-full bg-brand-sage/30" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-charcoal dark:text-dark-text">
                                            {appointment.student.firstName} {appointment.student.lastName}
                                        </p>
                                        <p className="text-xs capitalize text-muted dark:text-dark-muted">
                                            {appointment.type?.replace('-', ' ') || 'General Session'}
                                        </p>
                                    </div>

                                    <span className={statusBadgeClass(appointment.status)}>{appointment.status}</span>

                                    {appointment.status === 'PENDING' ? (
                                        <button
                                            type="button"
                                            onClick={() => onConfirmPending(appointment.id)}
                                            className="rounded-lg bg-brand-forest px-3 py-1.5 text-xs text-white transition-colors hover:bg-brand-forest/90"
                                        >
                                            Confirm
                                        </button>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
                    <h2 className="mb-5 font-heading text-lg font-semibold text-charcoal dark:text-dark-text">Recent Reviews</h2>
                    {stats.recentReviews.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted dark:text-dark-muted">No reviews yet</p>
                    ) : (
                        <div className="space-y-4">
                            {stats.recentReviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-dark-border">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-sage text-xs font-semibold text-white">
                                            {review.student.firstName[0]}
                                        </div>
                                        <span className="text-sm font-medium text-charcoal dark:text-dark-text">
                                            {review.student.firstName} {review.student.lastName}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <Star
                                                key={`${review.id}-${index}`}
                                                size={12}
                                                className={
                                                    index < review.rating
                                                        ? 'fill-brand-sand text-brand-sand'
                                                        : 'text-gray-300 dark:text-dark-border'
                                                }
                                            />
                                        ))}
                                    </div>
                                    {review.feedback ? (
                                        <p className="mt-1.5 line-clamp-2 text-xs italic text-slate dark:text-gray-400">“{review.feedback}”</p>
                                    ) : null}
                                    <p className="mt-1 text-xs text-muted dark:text-dark-muted">
                                        {formatDistanceToNow(new Date(review.updatedAt), { addSuffix: true })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <QuickActionCard
                    icon={Calendar}
                    title="Manage Appointments"
                    description="View and respond to booking requests"
                    href="/counsellor/appointments"
                    colorClass="bg-brand-forest/15 text-brand-forest dark:bg-brand-forest/25 dark:text-brand-mint"
                />
                <QuickActionCard
                    icon={Clock}
                    title="Set Availability"
                    description="Update your weekly schedule"
                    href="/counsellor/availability"
                    colorClass="bg-brand-sage/20 text-brand-forest dark:text-brand-mint"
                />
                <QuickActionCard
                    icon={UserCircle}
                    title="Edit Profile"
                    description="Update your bio, rates, and specializations"
                    href="/counsellor/profile"
                    colorClass="bg-brand-terracotta/15 text-brand-terracotta"
                />
            </div>
        </div>
    )
}
