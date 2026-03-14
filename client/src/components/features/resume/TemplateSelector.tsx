'use client'

import type { ResumeTemplate } from '@/types/resume'

interface TemplateSelectorProps {
  selected: ResumeTemplate
  onChange: (template: ResumeTemplate) => void
}

const templates: ResumeTemplate[] = ['classic', 'modern', 'minimal', 'professional']

function TemplateThumb({ template }: { template: ResumeTemplate }) {
  if (template === 'modern') {
    return (
      <div className="flex h-full w-full">
        <div className="w-[30%] bg-brand-forest" />
        <div className="flex-1 space-y-1.5 bg-white p-2">
          <div className="h-1 w-14 rounded bg-gray-300" />
          <div className="h-1 w-full rounded bg-gray-200" />
          <div className="h-1 w-10/12 rounded bg-gray-200" />
          <div className="mt-2 h-1 w-16 rounded bg-brand-sage/50" />
          <div className="h-1 w-full rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (template === 'minimal') {
    return (
      <div className="h-full w-full bg-white p-3">
        <div className="h-1 w-16 rounded bg-gray-400" />
        <div className="mt-3 h-1 w-24 rounded bg-gray-200" />
        <div className="mt-8 h-1 w-12 rounded bg-gray-300" />
        <div className="mt-2 h-1 w-full rounded bg-gray-200" />
        <div className="mt-1 h-1 w-11/12 rounded bg-gray-200" />
      </div>
    )
  }

  if (template === 'professional') {
    return (
      <div className="h-full w-full bg-white">
        <div className="h-4 bg-charcoal" />
        <div className="flex h-[calc(100%-16px)]">
          <div className="w-[65%] space-y-1 p-2">
            <div className="h-1 w-full rounded bg-gray-300" />
            <div className="h-1 w-10/12 rounded bg-gray-200" />
          </div>
          <div className="w-[35%] space-y-1 border-l border-gray-100 bg-brand-terracotta/10 p-2">
            <div className="h-1 w-full rounded bg-brand-terracotta/50" />
            <div className="h-1 w-4/5 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-white p-2.5">
      <div className="mx-auto h-1 w-20 rounded bg-gray-400" />
      <div className="mx-auto mt-1 h-1 w-28 rounded bg-gray-200" />
      <div className="mt-3 h-px w-full bg-gray-300" />
      <div className="mt-2 h-1 w-full rounded bg-gray-200" />
      <div className="mt-1 h-1 w-11/12 rounded bg-gray-200" />
      <div className="mt-3 h-1 w-16 rounded bg-gray-300" />
      <div className="mt-1 h-1 w-full rounded bg-gray-200" />
    </div>
  )
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="flex items-end gap-3">
      {templates.map((template) => {
        const isSelected = selected === template
        return (
          <button key={template} type="button" onClick={() => onChange(template)} className="group">
            <div
              className={`aspect-[210/297] w-20 overflow-hidden rounded-lg border transition-all sm:w-24 ${
                isSelected
                  ? 'border-brand-terracotta ring-2 ring-brand-terracotta'
                  : 'border-gray-200 hover:border-brand-sage dark:border-dark-border'
              }`}
            >
              <TemplateThumb template={template} />
            </div>
            <p className="mt-2 text-center text-xs font-medium capitalize text-charcoal dark:text-dark-text">{template}</p>
          </button>
        )
      })}
    </div>
  )
}
