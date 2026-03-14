'use client'

import { formatDistanceToNow } from 'date-fns'
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import {
    Briefcase,
    Calendar,
    ClipboardList,
    FileText,
    GraduationCap,
    TrendingUp,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react'

import { EmptyState } from '@/components/ui/EmptyState'
import { useAdminDashboard } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'

function MiniStatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType
    label: string
    value: number
}) {
    return (
        <div className="rounded-xl border border-border bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
            <div className="mb-2 flex items-center gap-2 text-muted dark:text-dark-muted">
                <Icon size={16} />
                <span className="text-xs">{label}</span>
            </div>
            <p className="font-mono text-xl font-bold text-charcoal dark:text-dark-text">{value}</p>
        </div>
    )
}

function GrowthCard({
    label,
    value,
    icon: Icon,
    colorClass,
    subtext,
}: {
    label: string
    value: number
    icon: React.ElementType
    colorClass: string
    subtext: string
}) {
    return (
        <div className={cn('rounded-xl border border-border bg-white p-5 pl-4 dark:border-dark-border dark:bg-dark-surface', colorClass)}>
            <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-brand-cream p-2 text-brand-forest dark:bg-dark-elevated dark:text-brand-mint">
                    <Icon size={16} />
                </div>
                <span className="text-sm text-muted dark:text-dark-muted">{label}</span>
            </div>
            <p className="font-mono text-2xl font-bold text-charcoal dark:text-dark-text">{value}</p>
            <p className="text-xs text-muted dark:text-dark-muted">{subtext}</p>
        </div>
    )
}

const pieColors = ['#2D6A4F', '#D4A373', '#1B4332', '#6C757D', '#E76F51', '#95D5B2']

export default function AdminDashboardPage() {
    const { data: stats, isLoading } = useAdminDashboard()

    if (isLoading) {
        return <div className="py-10 text-center text-muted dark:text-dark-muted">Loading dashboard...</div>
    }

    if (!stats) {
        return <EmptyState icon={Users} title="Dashboard unavailable" description="Unable to load admin dashboard data right now." />
    }

    const appointmentData = stats.appointmentBreakdown.map((item: { status: string; count: number }) => ({
        name: item.status,
        value: item.count,
    }))

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">Admin Dashboard</h1>
                <p className="mt-1 text-slate dark:text-dark-muted">Platform overview and management</p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                <MiniStatCard icon={Users} label="Total Users" value={stats.userCounts.total} />
                <MiniStatCard icon={GraduationCap} label="Students" value={stats.userCounts.students} />
                <MiniStatCard icon={UserCheck} label="Counsellors" value={stats.userCounts.counsellors} />
                <MiniStatCard icon={Briefcase} label="Careers" value={stats.totalCareers} />
                <MiniStatCard icon={ClipboardList} label="Assessments" value={stats.totalAssessments} />
                <MiniStatCard icon={Calendar} label="Appointments" value={stats.totalAppointments} />
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <GrowthCard label="New Users (This Week)" value={stats.newUsersThisWeek} icon={TrendingUp} colorClass="border-l-4 border-l-status-success" subtext="this week" />
                <GrowthCard label="New Users (This Month)" value={stats.newUsersThisMonth} icon={UserPlus} colorClass="border-l-4 border-l-brand-sage" subtext="this month" />
                <GrowthCard label="Assessments Taken" value={stats.attemptsThisMonth} icon={FileText} colorClass="border-l-4 border-l-brand-forest" subtext="this month" />
                <GrowthCard label="Sessions Booked" value={stats.appointmentsThisMonth} icon={Calendar} colorClass="border-l-4 border-l-brand-terracotta" subtext="this month" />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
                    <h3 className="mb-4 font-heading text-heading-4 font-semibold text-charcoal dark:text-dark-text">User Registrations (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={stats.registrationTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="count" stroke="#2D6A4F" fill="#95D5B2" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
                    <h3 className="mb-4 font-heading text-heading-4 font-semibold text-charcoal dark:text-dark-text">Appointment Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={appointmentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {appointmentData.map((_: unknown, index: number) => (
                                    <Cell key={`slice-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
                    <h3 className="font-heading text-heading-4 font-semibold text-charcoal dark:text-dark-text">Most Saved Careers</h3>
                    <div className="mt-4 space-y-3">
                        {stats.popularCareers.length === 0 ? (
                            <p className="text-sm text-muted dark:text-dark-muted">No saved careers data yet.</p>
                        ) : (
                            stats.popularCareers.map((career: { careerId: string; title: string; count: number }, index: number) => (
                                <div key={career.careerId} className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-forest/10 text-xs font-bold text-brand-forest dark:bg-brand-forest/20 dark:text-brand-mint">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-charcoal dark:text-dark-text">{career.title}</p>
                                        <div className="mt-1 h-2 w-full rounded-full bg-gray-100 dark:bg-dark-elevated">
                                            <div
                                                className="h-2 rounded-full bg-brand-sage"
                                                style={{ width: `${(career.count / (stats.popularCareers[0]?.count || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="font-mono text-sm font-semibold text-muted dark:text-dark-muted">{career.count}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
                    <h3 className="font-heading text-heading-4 font-semibold text-charcoal dark:text-dark-text">Recent Activity</h3>
                    <div className="mt-4 space-y-3">
                        {stats.recentActivity.length === 0 ? (
                            <p className="text-sm text-muted dark:text-dark-muted">No recent activity yet.</p>
                        ) : (
                            stats.recentActivity.map((log: { id: string; action: string; createdAt: string; user: { firstName: string; lastName: string } }) => (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 dark:border-dark-border"
                                >
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-sage" />
                                    <div>
                                        <p className="text-sm text-charcoal dark:text-dark-text">
                                            <span className="font-medium">{log.user.firstName} {log.user.lastName}</span> {log.action}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted dark:text-dark-muted">
                                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
