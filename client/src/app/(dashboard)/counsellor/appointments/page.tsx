'use client'

import { useMemo, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { useMyAppointments, useUpdateAppointment } from '@/hooks/useAppointments'
import { Appointment, UpdateAppointmentPayload } from '@/types/mentorship'
import { AppointmentCard } from '@/components/features/mentorship/AppointmentCard'
import { cn } from '@/lib/utils'

const TABS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const

const emptyStateByTab: Record<(typeof TABS)[number], string> = {
    ALL: 'No appointments found',
    PENDING: 'No pending requests at the moment',
    CONFIRMED: 'No upcoming sessions',
    COMPLETED: 'No completed sessions yet',
    CANCELLED: 'No cancelled appointments',
}

export default function CounsellorAppointmentsPage() {
    const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('ALL')
    const statusFilter = activeTab === 'ALL' ? undefined : activeTab

    const { data: appointments = [], isLoading } = useMyAppointments(statusFilter)
    const updateAppointment = useUpdateAppointment()

    const onStatusUpdate = async (appointmentId: string, payload: UpdateAppointmentPayload) => {
        await updateAppointment.mutateAsync({ appointmentId, payload })
    }

    const counts = useMemo(() => {
        const countMap = {
            ALL: appointments.length,
            PENDING: appointments.filter((item) => item.status === 'PENDING').length,
            CONFIRMED: appointments.filter((item) => item.status === 'CONFIRMED').length,
            COMPLETED: appointments.filter((item) => item.status === 'COMPLETED').length,
            CANCELLED: appointments.filter((item) => item.status === 'CANCELLED').length,
        }
        return countMap
    }, [appointments])

    return (
        <div className="mx-auto max-w-6xl pb-10">
            <h1 className="font-heading text-3xl font-bold text-charcoal dark:text-dark-text">Appointments</h1>
            <p className="mt-1 text-muted dark:text-dark-muted">Manage your mentorship sessions</p>

            <div className="mt-6 flex flex-wrap gap-2">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            'rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                            activeTab === tab
                                ? 'border-brand-forest bg-brand-forest text-white'
                                : 'border-border bg-white text-charcoal hover:bg-brand-cream dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-elevated'
                        )}
                    >
                        {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()} ({counts[tab]})
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-dark-elevated" />
                        ))}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-brand-ivory px-6 py-12 text-center dark:border-dark-border dark:bg-dark-surface">
                        <CalendarClock className="mx-auto mb-3 h-8 w-8 text-brand-forest dark:text-brand-mint" />
                        <p className="text-sm text-muted dark:text-dark-muted">{emptyStateByTab[activeTab]}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment: Appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                userRole="COUNSELLOR"
                                onStatusUpdate={onStatusUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
