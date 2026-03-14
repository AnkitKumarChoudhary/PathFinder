'use client'

import { useRouter } from 'next/navigation'
import { FileText, Plus, Copy, PencilLine, Star, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useCreateResume, useDeleteResume, useDuplicateResume, useResumes, useUpdateResume } from '@/hooks/useResumes'
import type { ResumeSummary } from '@/types/resume'

function ResumeCardSkeleton() {
  return <div className="h-60 animate-pulse rounded-xl border border-gray-100 bg-white dark:border-dark-border dark:bg-dark-surface" />
}

function TemplateMini({ template }: { template: ResumeSummary['template'] }) {
  if (template === 'modern') {
    return (
      <div className="flex h-20 rounded-lg border border-gray-200 bg-white">
        <div className="w-1/3 bg-brand-forest" />
        <div className="flex-1 p-2">
          <div className="h-1 w-8 rounded bg-gray-300" />
          <div className="mt-1 h-1 w-14 rounded bg-gray-200" />
          <div className="mt-3 h-1 w-16 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (template === 'professional') {
    return (
      <div className="h-20 rounded-lg border border-gray-200 bg-white">
        <div className="h-4 bg-charcoal" />
        <div className="flex h-16">
          <div className="w-2/3 p-2">
            <div className="h-1 w-16 rounded bg-gray-300" />
          </div>
          <div className="w-1/3 border-l bg-brand-terracotta/10" />
        </div>
      </div>
    )
  }

  if (template === 'minimal') {
    return (
      <div className="h-20 rounded-lg border border-gray-200 bg-white p-2">
        <div className="h-1 w-8 rounded bg-gray-400" />
        <div className="mt-2 h-1 w-14 rounded bg-gray-200" />
        <div className="mt-4 h-1 w-16 rounded bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="h-20 rounded-lg border border-gray-200 bg-white p-2">
      <div className="mx-auto h-1 w-10 rounded bg-gray-400" />
      <div className="mt-2 h-px w-full bg-gray-300" />
      <div className="mt-2 h-1 w-14 rounded bg-gray-200" />
      <div className="mt-1 h-1 w-12 rounded bg-gray-200" />
    </div>
  )
}

function ResumeListCard({
  resume,
  onEdit,
  onDuplicate,
  onSetDefault,
  onDelete,
}: {
  resume: ResumeSummary
  onEdit: () => void
  onDuplicate: () => void
  onSetDefault: () => void
  onDelete: () => void
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-dark-border dark:bg-dark-surface">
      <TemplateMini template={resume.template} />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-charcoal dark:text-dark-text">{resume.title}</h3>
          <p className="text-xs capitalize text-muted dark:text-dark-muted">{resume.template} template</p>
          <p className="mt-1 text-xs text-muted dark:text-dark-muted">
            Edited {formatDistanceToNow(new Date(resume.lastEdited), { addSuffix: true })}
          </p>
        </div>
        {resume.isDefault ? (
          <span className="rounded-full bg-brand-mint/20 px-2 py-0.5 text-xs font-semibold text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint">
            Default
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-terracotta px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta/90"
        >
          <PencilLine size={15} />
          Edit
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-charcoal transition-colors hover:border-brand-sage dark:border-dark-border dark:text-dark-text"
        >
          <Copy size={15} />
          Duplicate
        </button>
        <button
          type="button"
          onClick={onSetDefault}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-charcoal transition-colors hover:border-brand-sage dark:border-dark-border dark:text-dark-text"
        >
          <Star size={15} />
          Set Default
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-charcoal transition-colors hover:border-red-400 hover:text-red-500 dark:border-dark-border dark:text-dark-text"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default function ResumeListPage() {
  const router = useRouter()
  const { data: resumes = [], isLoading } = useResumes()
  const createMutation = useCreateResume()
  const deleteMutation = useDeleteResume()
  const duplicateMutation = useDuplicateResume()
  const updateMutation = useUpdateResume()

  const handleCreateResume = async () => {
    const created = await createMutation.mutateAsync({})
    router.push(`/student/resume/${created.id}`)
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this resume? This action cannot be undone.')
    if (!confirmed) return
    await deleteMutation.mutateAsync(id)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-charcoal dark:text-dark-text">Resume Builder</h1>
          <p className="mt-1 text-muted dark:text-dark-muted">Create, customize, and download professional resumes</p>
        </div>

        <button
          onClick={handleCreateResume}
          className="flex items-center gap-2 rounded-xl bg-brand-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta/90"
        >
          <Plus size={16} />
          New Resume
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ResumeCardSkeleton key={i} />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="py-20 text-center">
          <FileText size={48} className="mx-auto mb-4 text-muted" />
          <h3 className="font-heading text-xl font-semibold text-charcoal dark:text-dark-text">No resumes yet</h3>
          <p className="mt-2 text-muted dark:text-dark-muted">Create your first resume and stand out to recruiters</p>
          <button
            onClick={handleCreateResume}
            className="mt-4 rounded-xl bg-brand-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-terracotta/90"
          >
            Create Resume
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeListCard
              key={resume.id}
              resume={resume}
              onEdit={() => router.push(`/student/resume/${resume.id}`)}
              onDuplicate={() => duplicateMutation.mutate(resume.id)}
              onSetDefault={() => updateMutation.mutate({ id: resume.id, updates: { isDefault: true } })}
              onDelete={() => handleDelete(resume.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
