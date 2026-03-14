'use client'

import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  Briefcase,
  ChevronDown,
  FolderGit2,
  GraduationCap,
  Heart,
  Plus,
  Trophy,
  Trash2,
  UserCircle,
  Wrench,
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { TagInput } from './TagInput'
import type { ResumeData } from '@/types/resume'

interface ResumeFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

type SectionKey =
  | 'personal'
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'extraCurricular'

const sectionBaseClass =
  'cursor-pointer rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-dark-border dark:bg-dark-surface dark:hover:bg-dark-elevated'

const sectionContentMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

const monthFieldClass = 'mt-1 h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-charcoal focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30 focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text'

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function SectionHeader({
  title,
  icon,
  isOpen,
  count,
  onClick,
}: {
  title: string
  icon: React.ReactNode
  isOpen: boolean
  count?: number
  onClick: () => void
}) {
  return (
    <button type="button" className={`${sectionBaseClass} w-full`} onClick={onClick}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-charcoal dark:text-dark-text">
          {icon}
          <span className="font-heading font-semibold">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {typeof count === 'number' ? (
            <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs font-semibold text-brand-forest dark:bg-dark-elevated dark:text-brand-mint">
              {count}
            </span>
          ) : null}
          <ChevronDown
            size={18}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''} text-muted dark:text-dark-muted`}
          />
        </div>
      </div>
    </button>
  )
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
  } = useForm<ResumeData>({
    defaultValues: data,
  })

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    personal: true,
    education: true,
    experience: false,
    skills: false,
    projects: false,
    certifications: false,
    achievements: false,
    extraCurricular: false,
  })

  const educationArray = useFieldArray({ control, name: 'education' })
  const experienceArray = useFieldArray({ control, name: 'experience' })
  const projectsArray = useFieldArray({ control, name: 'projects' })
  const certificationsArray = useFieldArray({ control, name: 'certifications' })
  const achievementsArray = useFieldArray({ control, name: 'achievements' })
  const activitiesArray = useFieldArray({ control, name: 'extraCurricular' })

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as ResumeData)
    })

    return () => subscription.unsubscribe()
  }, [watch, onChange])

  const values = watch()

  const sectionCounts = useMemo(
    () => ({
      education: values.education?.length || 0,
      experience: values.experience?.length || 0,
      projects: values.projects?.length || 0,
      certifications: values.certifications?.length || 0,
      achievements: values.achievements?.length || 0,
      extraCurricular: values.extraCurricular?.length || 0,
    }),
    [values],
  )

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="space-y-4">
      <section>
        <SectionHeader
          title="Personal Information"
          icon={<UserCircle size={18} />}
          isOpen={openSections.personal}
          onClick={() => toggleSection('personal')}
        />

        <AnimatePresence>
          {openSections.personal ? (
            <motion.div {...sectionContentMotion} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="First Name" {...register('personalInfo.firstName')} />
                  <Input label="Last Name" {...register('personalInfo.lastName')} />
                  <Input label="Email" type="email" {...register('personalInfo.email')} />
                  <Input label="Phone" {...register('personalInfo.phone')} />
                  <Input label="Location" {...register('personalInfo.location')} />
                  <Input label="LinkedIn" {...register('personalInfo.linkedin')} />
                  <Input label="GitHub" {...register('personalInfo.github')} />
                  <Input label="Portfolio" {...register('personalInfo.portfolio')} />
                </div>
                <div className="mt-4">
                  <Textarea
                    label="Professional Summary"
                    placeholder="Write a brief 2-3 sentence professional summary..."
                    rows={4}
                    {...register('personalInfo.summary')}
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section>
        <SectionHeader
          title="Education"
          icon={<GraduationCap size={18} />}
          isOpen={openSections.education}
          count={sectionCounts.education}
          onClick={() => toggleSection('education')}
        />

        <AnimatePresence>
          {openSections.education ? (
            <motion.div {...sectionContentMotion} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-3 space-y-3">
                {educationArray.fields.map((field, index) => {
                  const current = getValues(`education.${index}`)
                  return (
                    <div key={field.id} className="relative rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted transition-colors hover:text-red-500"
                        onClick={() => educationArray.remove(index)}
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input label="Institution" {...register(`education.${index}.institution`)} />
                        <Input label="Degree" {...register(`education.${index}.degree`)} />

                        <div>
                          <label className="text-sm font-medium text-charcoal dark:text-dark-text">Start Date</label>
                          <input type="month" {...register(`education.${index}.startDate`)} className={monthFieldClass} />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal dark:text-dark-text">End Date</label>
                          <input
                            type="month"
                            disabled={Boolean(current?.current)}
                            {...register(`education.${index}.endDate`)}
                            className={monthFieldClass}
                          />
                        </div>

                        <Input label="Grade / CGPA" {...register(`education.${index}.grade`)} />

                        <label className="mt-8 flex items-center gap-2 text-sm text-charcoal dark:text-dark-text">
                          <input
                            type="checkbox"
                            checked={Boolean(current?.current)}
                            onChange={(event) => {
                              setValue(`education.${index}.current`, event.target.checked)
                              if (event.target.checked) setValue(`education.${index}.endDate`, '')
                            }}
                          />
                          Currently studying here
                        </label>
                      </div>

                      <div className="mt-4">
                        <label className="mb-1 block text-sm font-medium text-charcoal dark:text-dark-text">Highlights</label>
                        <Controller
                          control={control}
                          name={`education.${index}.highlights`}
                          render={({ field: formField }) => (
                            <TagInput
                              tags={formField.value || []}
                              onChange={formField.onChange}
                              placeholder="Add highlights and press Enter"
                            />
                          )}
                        />
                      </div>
                    </div>
                  )
                })}

                <button
                  type="button"
                  onClick={() =>
                    educationArray.append({
                      id: createId('edu'),
                      institution: '',
                      degree: '',
                      startDate: '',
                      endDate: '',
                      grade: '',
                      current: false,
                      highlights: [],
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-brand-sage dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                >
                  <Plus size={16} />
                  Add Education
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section>
        <SectionHeader
          title="Experience"
          icon={<Briefcase size={18} />}
          isOpen={openSections.experience}
          count={sectionCounts.experience}
          onClick={() => toggleSection('experience')}
        />

        <AnimatePresence>
          {openSections.experience ? (
            <motion.div {...sectionContentMotion} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-3 space-y-3">
                {experienceArray.fields.map((field, index) => {
                  const current = getValues(`experience.${index}`)
                  return (
                    <div key={field.id} className="relative rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted transition-colors hover:text-red-500"
                        onClick={() => experienceArray.remove(index)}
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input label="Company" {...register(`experience.${index}.company`)} />
                        <Input label="Position" {...register(`experience.${index}.position`)} />
                        <Input label="Location" {...register(`experience.${index}.location`)} />

                        <label className="mt-8 flex items-center gap-2 text-sm text-charcoal dark:text-dark-text">
                          <input
                            type="checkbox"
                            checked={Boolean(current?.current)}
                            onChange={(event) => {
                              setValue(`experience.${index}.current`, event.target.checked)
                              if (event.target.checked) setValue(`experience.${index}.endDate`, '')
                            }}
                          />
                          Currently working here
                        </label>

                        <div>
                          <label className="text-sm font-medium text-charcoal dark:text-dark-text">Start Date</label>
                          <input type="month" {...register(`experience.${index}.startDate`)} className={monthFieldClass} />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-charcoal dark:text-dark-text">End Date</label>
                          <input
                            type="month"
                            disabled={Boolean(current?.current)}
                            {...register(`experience.${index}.endDate`)}
                            className={monthFieldClass}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="mb-1 block text-sm font-medium text-charcoal dark:text-dark-text">Description Bullets</label>
                        <Controller
                          control={control}
                          name={`experience.${index}.description`}
                          render={({ field: formField }) => (
                            <TagInput
                              tags={formField.value || []}
                              onChange={formField.onChange}
                              placeholder="Add bullet points and press Enter"
                            />
                          )}
                        />
                      </div>
                    </div>
                  )
                })}

                <button
                  type="button"
                  onClick={() =>
                    experienceArray.append({
                      id: createId('exp'),
                      company: '',
                      position: '',
                      startDate: '',
                      endDate: '',
                      current: false,
                      location: '',
                      description: [],
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-brand-sage dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                >
                  <Plus size={16} />
                  Add Experience
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section>
        <SectionHeader
          title="Skills"
          icon={<Wrench size={18} />}
          isOpen={openSections.skills}
          onClick={() => toggleSection('skills')}
        />

        <AnimatePresence>
          {openSections.skills ? (
            <motion.div {...sectionContentMotion} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal dark:text-dark-text">Technical Skills</label>
                    <Controller
                      control={control}
                      name="skills.technical"
                      render={({ field }) => (
                        <TagInput tags={field.value || []} onChange={field.onChange} placeholder="Python, React, SQL" />
                      )}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal dark:text-dark-text">Soft Skills</label>
                    <Controller
                      control={control}
                      name="skills.soft"
                      render={({ field }) => (
                        <TagInput tags={field.value || []} onChange={field.onChange} placeholder="Leadership, Communication" />
                      )}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal dark:text-dark-text">Tools</label>
                    <Controller
                      control={control}
                      name="skills.tools"
                      render={({ field }) => (
                        <TagInput tags={field.value || []} onChange={field.onChange} placeholder="Docker, Git, Figma" />
                      )}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal dark:text-dark-text">Languages</label>
                    <Controller
                      control={control}
                      name="skills.languages"
                      render={({ field }) => (
                        <TagInput tags={field.value || []} onChange={field.onChange} placeholder="English, Hindi" />
                      )}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section>
        <SectionHeader
          title="Projects"
          icon={<FolderGit2 size={18} />}
          isOpen={openSections.projects}
          count={sectionCounts.projects}
          onClick={() => toggleSection('projects')}
        />

        <AnimatePresence>
          {openSections.projects ? (
            <motion.div {...sectionContentMotion} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-3 space-y-3">
                {projectsArray.fields.map((field, index) => (
                  <div key={field.id} className="relative rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted transition-colors hover:text-red-500"
                      onClick={() => projectsArray.remove(index)}
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input label="Project Name" {...register(`projects.${index}.name`)} />
                      <Input label="Repository Link" {...register(`projects.${index}.link`)} />
                      <Input label="Live URL" {...register(`projects.${index}.liveUrl`)} />
                      <div>
                        <label className="text-sm font-medium text-charcoal dark:text-dark-text">Start Date</label>
                        <input type="month" {...register(`projects.${index}.startDate`)} className={monthFieldClass} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-charcoal dark:text-dark-text">End Date</label>
                        <input type="month" {...register(`projects.${index}.endDate`)} className={monthFieldClass} />
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <Textarea label="Description" rows={3} {...register(`projects.${index}.description`)} />

                      <div>
                        <label className="mb-1 block text-sm font-medium text-charcoal dark:text-dark-text">Technologies</label>
                        <Controller
                          control={control}
                          name={`projects.${index}.technologies`}
                          render={({ field: formField }) => (
                            <TagInput
                              tags={formField.value || []}
                              onChange={formField.onChange}
                              placeholder="Next.js, Express, PostgreSQL"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    projectsArray.append({
                      id: createId('proj'),
                      name: '',
                      description: '',
                      technologies: [],
                      link: '',
                      liveUrl: '',
                      startDate: '',
                      endDate: '',
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-brand-sage dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                >
                  <Plus size={16} />
                  Add Project
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section>
        <SectionHeader
          title="Certifications"
          icon={<Award size={18} />}
          isOpen={openSections.certifications}
          count={sectionCounts.certifications}
          onClick={() => toggleSection('certifications')}
        />

        <AnimatePresence>
          {openSections.certifications ? (
            <motion.div {...sectionContentMotion} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-3 space-y-3">
                {certificationsArray.fields.map((field, index) => (
                  <div key={field.id} className="relative rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted transition-colors hover:text-red-500"
                      onClick={() => certificationsArray.remove(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input label="Certification" {...register(`certifications.${index}.name`)} />
                      <Input label="Issuer" {...register(`certifications.${index}.issuer`)} />
                      <div>
                        <label className="text-sm font-medium text-charcoal dark:text-dark-text">Date</label>
                        <input type="month" {...register(`certifications.${index}.date`)} className={monthFieldClass} />
                      </div>
                      <Input label="Credential URL" {...register(`certifications.${index}.credentialUrl`)} />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    certificationsArray.append({
                      id: createId('cert'),
                      name: '',
                      issuer: '',
                      date: '',
                      credentialUrl: '',
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-brand-sage dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                >
                  <Plus size={16} />
                  Add Certification
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section>
        <SectionHeader
          title="Achievements"
          icon={<Trophy size={18} />}
          isOpen={openSections.achievements}
          count={sectionCounts.achievements}
          onClick={() => toggleSection('achievements')}
        />

        <AnimatePresence>
          {openSections.achievements ? (
            <motion.div {...sectionContentMotion} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-3 space-y-3">
                {achievementsArray.fields.map((field, index) => (
                  <div key={field.id} className="relative rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted transition-colors hover:text-red-500"
                      onClick={() => achievementsArray.remove(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input label="Title" {...register(`achievements.${index}.title`)} />
                      <div>
                        <label className="text-sm font-medium text-charcoal dark:text-dark-text">Date</label>
                        <input type="month" {...register(`achievements.${index}.date`)} className={monthFieldClass} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Textarea label="Description" rows={3} {...register(`achievements.${index}.description`)} />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    achievementsArray.append({
                      id: createId('ach'),
                      title: '',
                      description: '',
                      date: '',
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-brand-sage dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                >
                  <Plus size={16} />
                  Add Achievement
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      <section>
        <SectionHeader
          title="Extra-Curricular Activities"
          icon={<Heart size={18} />}
          isOpen={openSections.extraCurricular}
          count={sectionCounts.extraCurricular}
          onClick={() => toggleSection('extraCurricular')}
        />

        <AnimatePresence>
          {openSections.extraCurricular ? (
            <motion.div {...sectionContentMotion} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-3 space-y-3">
                {activitiesArray.fields.map((field, index) => (
                  <div key={field.id} className="relative rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted transition-colors hover:text-red-500"
                      onClick={() => activitiesArray.remove(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Input label="Activity" {...register(`extraCurricular.${index}.activity`)} />
                      <Input label="Duration" {...register(`extraCurricular.${index}.duration`)} />
                    </div>
                    <div className="mt-4">
                      <Textarea label="Description" rows={3} {...register(`extraCurricular.${index}.description`)} />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    activitiesArray.append({
                      id: createId('ec'),
                      activity: '',
                      description: '',
                      duration: '',
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-brand-sage dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
                >
                  <Plus size={16} />
                  Add Activity
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </div>
  )
}
