'use client'

import { useMemo, useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { useAdminCareers, useCreateCareer, useDeleteCareer, useUpdateCareer } from '@/hooks/useAdmin'
import { AdminCareer } from '@/types/admin'
import { CareerFormModal } from '@/components/features/admin/CareerFormModal'

export default function AdminCareersPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCareer, setEditingCareer] = useState<AdminCareer | null>(null)

    const query = useMemo(
        () => ({ page, limit: 10, search: search || undefined, category: category || undefined }),
        [category, page, search]
    )

    const { data, isLoading } = useAdminCareers(query)
    const createCareerMutation = useCreateCareer()
    const updateCareerMutation = useUpdateCareer()
    const deleteCareerMutation = useDeleteCareer()

    const careers: AdminCareer[] = data?.careers || []
    const pagination = data?.pagination

    const categoryOptions = useMemo(() => {
        const unique = Array.from(new Set((careers || []).map((career) => career.category).filter(Boolean)))
        return unique.sort((a, b) => a.localeCompare(b))
    }, [careers])

    const onCreateClick = () => {
        setEditingCareer(null)
        setIsFormOpen(true)
    }

    const onEditClick = (career: AdminCareer) => {
        setEditingCareer(career)
        setIsFormOpen(true)
    }

    const onDeleteClick = async (career: AdminCareer) => {
        const confirmed = window.confirm(`Delete ${career.title}? This will mark it inactive.`)
        if (!confirmed) return
        await deleteCareerMutation.mutateAsync(career.id)
    }

    const handleFormSubmit = async (payload: Record<string, unknown>) => {
        if (editingCareer) {
            await updateCareerMutation.mutateAsync({ id: editingCareer.id, updates: payload })
            return
        }

        await createCareerMutation.mutateAsync(payload)
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">Career Management</h1>
                    <p className="text-slate dark:text-dark-muted">Add, edit, and manage career paths</p>
                </div>
                <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={onCreateClick}>
                    Add Career
                </Button>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <Input
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value)
                        setPage(1)
                    }}
                    placeholder="Search careers"
                    className="max-w-xl"
                />

                <Select
                    value={category}
                    onChange={(event) => {
                        setCategory(event.target.value)
                        setPage(1)
                    }}
                    className="w-[260px]"
                >
                    <option value="">All Categories</option>
                    {categoryOptions.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </Select>
            </div>

            {isLoading ? (
                <div className="rounded-xl border border-border bg-white p-8 text-center text-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
                    Loading careers...
                </div>
            ) : careers.length === 0 ? (
                <EmptyState icon={Briefcase} title="No careers found" description="Try updating filters or create a new career entry." />
            ) : (
                <>
                    <div className="overflow-hidden rounded-xl border border-border bg-white dark:border-dark-border dark:bg-dark-surface">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 dark:border-dark-border dark:bg-dark-elevated">
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Title</th>
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Category</th>
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Status</th>
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Created</th>
                                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-muted dark:text-dark-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {careers.map((career) => (
                                    <tr
                                        key={career.id}
                                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/50 dark:border-dark-border dark:hover:bg-dark-elevated/50"
                                    >
                                        <td className="p-4 text-sm font-medium text-charcoal dark:text-dark-text">{career.title}</td>
                                        <td className="p-4">
                                            <Badge variant="mint" size="sm">
                                                {career.category}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={career.isActive ? 'success' : 'gray'} size="sm">
                                                {career.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-muted dark:text-dark-muted">{new Date(career.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="link" size="sm" className="px-0" onClick={() => onEditClick(career)}>
                                                    Edit
                                                </Button>
                                                <Button variant="link" size="sm" className="px-0 text-status-error dark:text-status-error" onClick={() => onDeleteClick(career)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

            <CareerFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                career={editingCareer}
                onSubmit={handleFormSubmit}
            />
        </div>
    )
}
