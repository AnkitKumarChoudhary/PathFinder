'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useResume, useUpdateResume } from '@/hooks/useResumes'
import { defaultResumeData, type ResumeData, type ResumeTemplate } from '@/types/resume'
import { ResumeForm } from '@/components/features/resume/ResumeForm'
import { ResumePreview } from '@/components/features/resume/ResumePreview'
import { TemplateSelector } from '@/components/features/resume/TemplateSelector'
import { PDFDownloadButton } from '@/components/features/resume/PDFDownloadButton'

export default function ResumeEditorPage() {
  const params = useParams<{ id: string }>()
  const resumeId = params?.id || ''
  const { data: resume, isLoading } = useResume(resumeId)
  const updateMutation = useUpdateResume()

  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [template, setTemplate] = useState<ResumeTemplate>('classic')
  const [title, setTitle] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (resume) {
      setResumeData((resume.data as ResumeData) || defaultResumeData)
      setTemplate(resume.template)
      setTitle(resume.title)
    }
  }, [resume])

  const debouncedData = useDebounce(resumeData, 3000)
  const debouncedTitle = useDebounce(title, 1200)
  const debouncedTemplate = useDebounce(template, 1200)

  const hasChanges = useMemo(() => {
    if (!resume || !debouncedData) return false
    return (
      JSON.stringify(debouncedData) !== JSON.stringify(resume.data) ||
      debouncedTemplate !== resume.template ||
      debouncedTitle !== resume.title
    )
  }, [resume, debouncedData, debouncedTemplate, debouncedTitle])

  useEffect(() => {
    if (!resume || !debouncedData || !hasChanges) return

    updateMutation.mutate({
      id: resume.id,
      updates: { data: debouncedData, template: debouncedTemplate, title: debouncedTitle },
    })
  }, [debouncedData, debouncedTemplate, debouncedTitle, resume, hasChanges, updateMutation])

  if (isLoading || !resumeData || !resume) {
    return (
      <div className="space-y-4">
        <div className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-dark-elevated" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-[70vh] animate-pulse rounded-xl bg-gray-100 dark:bg-dark-elevated" />
          <div className="h-[70vh] animate-pulse rounded-xl bg-gray-100 dark:bg-dark-elevated" />
        </div>
      </div>
    )
  }

  return (
    <div className="-m-6 min-h-screen">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3 dark:border-dark-border dark:bg-dark-surface">
        <div className="flex items-center gap-4">
          <Link href="/student/resume?from=editor" className="text-muted transition-colors hover:text-charcoal dark:hover:text-dark-text">
            <ArrowLeft size={20} />
          </Link>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="bg-transparent font-heading text-lg font-semibold text-charcoal outline-none focus:underline dark:text-dark-text"
            placeholder="Resume title..."
          />

          {updateMutation.isPending ? (
            <span className="flex items-center gap-1 text-xs text-muted dark:text-dark-muted">
              <div className="h-3 w-3 animate-spin rounded-full border border-muted border-t-transparent" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-status-success">
              <Check size={12} />
              Saved
            </span>
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <TemplateSelector selected={template} onChange={setTemplate} />
          <PDFDownloadButton previewRef={previewRef} fileName={`${title || 'resume'}.pdf`} />
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white px-4 py-3 dark:border-dark-border dark:bg-dark-surface lg:hidden">
        <div className="mb-3 overflow-x-auto">
          <TemplateSelector selected={template} onChange={setTemplate} />
        </div>
        <PDFDownloadButton previewRef={previewRef} fileName={`${title || 'resume'}.pdf`} />
      </div>

      <div className="border-b border-gray-100 bg-white px-6 dark:border-dark-border dark:bg-dark-surface lg:hidden">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'edit' ? 'border-b-2 border-brand-terracotta text-brand-terracotta' : 'text-muted dark:text-dark-muted'}`}
            onClick={() => setActiveTab('edit')}
          >
            Edit
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'preview' ? 'border-b-2 border-brand-terracotta text-brand-terracotta' : 'text-muted dark:text-dark-muted'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-65px)] flex-col lg:flex-row">
        <div
          className={`overflow-y-auto bg-brand-cream/30 p-6 dark:bg-dark-bg lg:w-1/2 ${
            activeTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <ResumeForm data={resumeData} onChange={setResumeData} />
        </div>

        <div
          className={`overflow-y-auto border-l border-gray-200 bg-gray-200 p-6 dark:border-dark-border dark:bg-dark-bg lg:w-1/2 ${
            activeTab === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <ResumePreview data={resumeData} template={template} previewRef={previewRef} />
        </div>
      </div>
    </div>
  )
}
