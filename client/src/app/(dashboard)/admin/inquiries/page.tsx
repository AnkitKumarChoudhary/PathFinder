'use client'

import { useMemo, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { useAdminInquiries } from '@/hooks/useAdmin'

export default function AdminInquiriesPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')

  const query = useMemo(() => ({ page, limit: 10, status: status || undefined }), [page, status])
  const { data, isLoading } = useAdminInquiries(query)

  const inquiries = data?.inquiries || []
  const pagination = data?.pagination

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-dark-text">Inquiries</h1>
          <p className="text-slate dark:text-dark-muted">Review contact and support inquiries from users</p>
        </div>

        <Select value={status} onChange={(event) => setStatus(event.target.value)} className="w-[200px]">
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center text-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
          Loading inquiries...
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No inquiries found" description="Incoming inquiries will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {inquiries.map((item: any) => (
              <article key={item.id} className="rounded-xl border border-border bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-medium text-charcoal dark:text-dark-text">{item.subject}</h3>
                  <span className={item.isResolved ? 'text-xs text-status-success' : 'text-xs text-status-warning'}>
                    {item.isResolved ? 'Resolved' : 'Open'}
                  </span>
                </div>
                <p className="text-sm text-muted dark:text-dark-muted">{item.name} • {item.email}</p>
                <p className="mt-2 text-sm text-charcoal dark:text-dark-text">{item.message}</p>
                <p className="mt-2 text-xs text-muted dark:text-dark-muted">
                  {new Date(item.createdAt).toLocaleString('en-IN')}
                </p>
              </article>
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
    </div>
  )
}
