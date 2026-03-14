'use client'

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAdminDashboard } from '@/hooks/useAdmin'

const chartColors = ['#1B4332', '#2D6A4F', '#D4A373', '#E76F51', '#95D5B2', '#6C757D']

export default function AdminAnalyticsPage() {
    const { data: stats, isLoading } = useAdminDashboard()

    if (isLoading) {
        return <div className="py-10 text-center text-muted dark:text-dark-muted">Loading analytics...</div>
    }

    if (!stats) {
        return <EmptyState icon={BarChart3} title="Analytics unavailable" description="Unable to load analytics right now." />
    }

    const appointmentData = stats.appointmentBreakdown.map((item: { status: string; count: number }) => ({
        name: item.status,
        value: item.count,
    }))

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">Analytics</h1>
                <p className="text-slate dark:text-dark-muted">Platform trends and distributions</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
                    <h3 className="mb-4 font-heading text-heading-4 font-semibold text-charcoal dark:text-dark-text">Registration Trend</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={stats.registrationTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#2D6A4F" radius={[8, 8, 0, 0]} name="Users" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
                    <h3 className="mb-4 font-heading text-heading-4 font-semibold text-charcoal dark:text-dark-text">Appointment Distribution</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={appointmentData} dataKey="value" nameKey="name" outerRadius={95} innerRadius={60} label>
                                {appointmentData.map((_: unknown, index: number) => (
                                    <Cell key={`analytics-slice-${index}`} fill={chartColors[index % chartColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
