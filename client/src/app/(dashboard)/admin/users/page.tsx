'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { useAdminUser, useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'
import { AdminUser } from '@/types/admin'

function roleBadge(role: string) {
    if (role === 'STUDENT') return 'forest'
    if (role === 'COUNSELLOR') return 'mint'
    if (role === 'PARENT') return 'sand'
    if (role === 'ADMIN') return 'terracotta'
    return 'gray'
}

export default function AdminUsersPage() {
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput.trim())
            setPage(1)
        }, 350)

        return () => clearTimeout(timeout)
    }, [searchInput])

    const query = useMemo(
        () => ({ page, limit: 10, search: search || undefined, role: role || undefined, status: status || undefined }),
        [page, role, search, status]
    )

    const { data, isLoading } = useAdminUsers(query)
    const updateStatusMutation = useUpdateUserStatus()

    const users = data?.users || []
    const pagination = data?.pagination

    const { data: selectedUserData } = useAdminUser(selectedUserId || '')
    const selectedUser = selectedUserData?.user

    const onToggleStatus = async (user: AdminUser) => {
        await updateStatusMutation.mutateAsync({ id: user.id, isActive: !user.isActive })
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">User Management</h1>
                    <p className="text-slate dark:text-dark-muted">Manage all platform users</p>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] max-w-md flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-dark-muted" />
                    <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="pl-9" placeholder="Search users by name or email" />
                </div>

                <Select value={role} onChange={(event) => setRole(event.target.value)} className="w-[180px]">
                    <option value="">All Roles</option>
                    <option value="STUDENT">Student</option>
                    <option value="COUNSELLOR">Counsellor</option>
                    <option value="PARENT">Parent</option>
                    <option value="ADMIN">Admin</option>
                </Select>

                <Select value={status} onChange={(event) => setStatus(event.target.value)} className="w-[180px]">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </Select>
            </div>

            {isLoading ? (
                <div className="rounded-xl border border-border bg-white p-8 text-center text-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
                    Loading users...
                </div>
            ) : users.length === 0 ? (
                <EmptyState icon={User} title="No users found" description="Try changing your search or filters." />
            ) : (
                <>
                    <div className="hidden overflow-hidden rounded-xl border border-border bg-white dark:border-dark-border dark:bg-dark-surface md:block">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 dark:border-dark-border dark:bg-dark-elevated">
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">User</th>
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Role</th>
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Status</th>
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Joined</th>
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user: AdminUser) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-dark-border dark:hover:bg-dark-elevated/50"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-forest/15 font-semibold text-brand-forest dark:bg-brand-forest/20 dark:text-brand-mint">
                                                    {user.firstName.charAt(0)}
                                                    {user.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-charcoal dark:text-dark-text">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="text-xs text-muted dark:text-dark-muted">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge size="sm" variant={roleBadge(user.role) as any}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn('inline-flex items-center gap-1.5 text-sm', user.isActive ? 'text-status-success' : 'text-muted dark:text-dark-muted')}>
                                                <span className={cn('h-2 w-2 rounded-full', user.isActive ? 'bg-status-success' : 'bg-muted')} />
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-muted dark:text-dark-muted">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="link" size="sm" className="px-0" onClick={() => setSelectedUserId(user.id)}>
                                                    View
                                                </Button>
                                                <Button
                                                    variant={user.isActive ? 'outline' : 'secondary'}
                                                    size="sm"
                                                    onClick={() => onToggleStatus(user)}
                                                    loading={updateStatusMutation.isPending}
                                                >
                                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-3 md:hidden">
                        {users.map((user: AdminUser) => (
                            <div key={user.id} className="rounded-xl border border-border bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-charcoal dark:text-dark-text">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <Badge size="sm" variant={roleBadge(user.role) as any}>
                                        {user.role}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted dark:text-dark-muted">{user.email}</p>
                                <p className="mt-2 text-xs text-muted dark:text-dark-muted">Joined: {new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
                                <div className="mt-3 flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setSelectedUserId(user.id)}>
                                        View
                                    </Button>
                                    <Button variant={user.isActive ? 'outline' : 'secondary'} size="sm" onClick={() => onToggleStatus(user)}>
                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination ? (
                        <div className="mt-6">
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages || 1}
                                pageSize={pagination.limit}
                                totalItems={pagination.total}
                                onPageChange={setPage}
                            />
                        </div>
                    ) : null}
                </>
            )}

            <Modal isOpen={!!selectedUserId} onClose={() => setSelectedUserId(null)} title="User Details" size="md">
                {!selectedUser ? (
                    <p className="text-sm text-muted dark:text-dark-muted">Loading user details...</p>
                ) : (
                    <div className="space-y-3 text-sm">
                        <p className="text-charcoal dark:text-dark-text">
                            <span className="font-semibold">Name:</span> {selectedUser.firstName} {selectedUser.lastName}
                        </p>
                        <p className="text-charcoal dark:text-dark-text">
                            <span className="font-semibold">Email:</span> {selectedUser.email}
                        </p>
                        <p className="text-charcoal dark:text-dark-text">
                            <span className="font-semibold">Role:</span> {selectedUser.role}
                        </p>
                        <p className="text-charcoal dark:text-dark-text">
                            <span className="font-semibold">Phone:</span> {selectedUser.phone || 'Not provided'}
                        </p>
                        <p className="text-charcoal dark:text-dark-text">
                            <span className="font-semibold">Joined:</span> {new Date(selectedUser.createdAt).toLocaleString('en-IN')}
                        </p>
                        <p className="text-charcoal dark:text-dark-text">
                            <span className="font-semibold">Active:</span> {selectedUser.isActive ? 'Yes' : 'No'}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    )
}
