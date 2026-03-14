'use client'

import type { ReactNode, RefObject } from 'react'
import type { ResumeData, ResumeTemplate } from '@/types/resume'

interface ResumePreviewProps {
  data: ResumeData
  template: ResumeTemplate
  previewRef: RefObject<HTMLDivElement>
}

function Section({ title, children, accentClass = 'text-charcoal' }: { title: string; children: ReactNode; accentClass?: string }) {
  return (
    <section className="mt-4">
      <h3 className={`mb-1.5 border-b border-gray-300 pb-1 text-[10pt] font-bold uppercase tracking-wide ${accentClass}`}>
        {title}
      </h3>
      {children}
    </section>
  )
}

const hasText = (value?: string) => Boolean(value && value.trim())

export function ResumePreview({ data, template, previewRef }: ResumePreviewProps) {
  const fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim() || 'Your Name'
  const contact = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.github,
    data.personalInfo.portfolio,
  ].filter(hasText)

  if (template === 'modern') {
    return (
      <div className="max-h-[calc(100vh-200px)] overflow-auto rounded-xl bg-gray-200 p-6 dark:bg-dark-bg">
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
          <div ref={previewRef}>
            <div className="mx-auto flex bg-white shadow-lg" style={{ width: '210mm', minHeight: '297mm' }}>
              <aside className="w-[30%] bg-brand-forest p-6 text-white">
                <h1 className="text-xl font-bold leading-tight">{fullName}</h1>
                <p className="mt-3 text-[9pt] leading-5 opacity-90">{contact.join(' • ')}</p>

                {(data.skills.technical.length > 0 || data.skills.tools.length > 0 || data.skills.languages.length > 0) && (
                  <section className="mt-6">
                    <h3 className="text-[10pt] font-semibold uppercase tracking-wide text-brand-cream">Skills</h3>
                    {data.skills.technical.length > 0 && (
                      <p className="mt-1 text-[9pt]">Technical: {data.skills.technical.join(', ')}</p>
                    )}
                    {data.skills.tools.length > 0 && <p className="mt-1 text-[9pt]">Tools: {data.skills.tools.join(', ')}</p>}
                    {data.skills.languages.length > 0 && (
                      <p className="mt-1 text-[9pt]">Languages: {data.skills.languages.join(', ')}</p>
                    )}
                  </section>
                )}

                {data.certifications.length > 0 && (
                  <section className="mt-6">
                    <h3 className="text-[10pt] font-semibold uppercase tracking-wide text-brand-cream">Certifications</h3>
                    {data.certifications.map((cert) => (
                      <p key={cert.id} className="mt-1 text-[9pt]">
                        {cert.name} — {cert.issuer}
                      </p>
                    ))}
                  </section>
                )}
              </aside>

              <main className="w-[70%] p-7" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10pt', lineHeight: 1.45, color: '#212529' }}>
                {hasText(data.personalInfo.summary) && (
                  <Section title="Summary" accentClass="text-brand-forest">
                    <p>{data.personalInfo.summary}</p>
                  </Section>
                )}

                {data.experience.length > 0 && (
                  <Section title="Experience" accentClass="text-brand-forest">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="mb-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold">{exp.company}</p>
                          <p className="text-[9pt] text-muted">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                        </div>
                        <p className="text-[9pt]">{exp.position}</p>
                        {exp.description.length > 0 && (
                          <ul className="list-disc pl-4">
                            {exp.description.map((item, index) => (
                              <li key={`${exp.id}-${index}`}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </Section>
                )}

                {data.education.length > 0 && (
                  <Section title="Education" accentClass="text-brand-forest">
                    {data.education.map((edu) => (
                      <div key={edu.id} className="mb-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-semibold">{edu.institution}</p>
                          <p className="text-[9pt] text-muted">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                        </div>
                        <p>{edu.degree}</p>
                      </div>
                    ))}
                  </Section>
                )}

                {data.projects.length > 0 && (
                  <Section title="Projects" accentClass="text-brand-forest">
                    {data.projects.map((project) => (
                      <div key={project.id} className="mb-2.5">
                        <p className="font-semibold">{project.name}</p>
                        <p>{project.description}</p>
                        {project.technologies.length > 0 && <p className="italic">{project.technologies.join(', ')}</p>}
                      </div>
                    ))}
                  </Section>
                )}

                {data.achievements.length > 0 && (
                  <Section title="Achievements" accentClass="text-brand-forest">
                    {data.achievements.map((achievement) => (
                      <p key={achievement.id} className="mb-1.5">
                        <span className="font-semibold">{achievement.title}</span> — {achievement.description}
                      </p>
                    ))}
                  </Section>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (template === 'minimal') {
    return (
      <div className="max-h-[calc(100vh-200px)] overflow-auto rounded-xl bg-gray-200 p-6 dark:bg-dark-bg">
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
          <div ref={previewRef}>
            <div
              className="mx-auto bg-white shadow-lg"
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm 15mm',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10pt',
                lineHeight: 1.5,
                color: '#212529',
              }}
            >
              <h1 className="text-[24pt] font-light">{fullName}</h1>
              <p className="mt-2 text-[9pt] text-muted">{contact.join(' • ')}</p>

              {hasText(data.personalInfo.summary) && (
                <section className="mt-8">
                  <h3 className="text-[8pt] uppercase tracking-[0.2em] text-muted">Summary</h3>
                  <p className="mt-2">{data.personalInfo.summary}</p>
                </section>
              )}

              {data.experience.length > 0 && (
                <section className="mt-8">
                  <h3 className="text-[8pt] uppercase tracking-[0.2em] text-muted">Experience</h3>
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="mt-3">
                      <div className="flex items-start justify-between">
                        <p className="font-medium">{exp.company}</p>
                        <p className="text-[9pt] text-muted">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      </div>
                      <p>{exp.position}</p>
                    </div>
                  ))}
                </section>
              )}

              {data.education.length > 0 && (
                <section className="mt-8">
                  <h3 className="text-[8pt] uppercase tracking-[0.2em] text-muted">Education</h3>
                  {data.education.map((edu) => (
                    <div key={edu.id} className="mt-3">
                      <div className="flex items-start justify-between">
                        <p className="font-medium">{edu.institution}</p>
                        <p className="text-[9pt] text-muted">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                      </div>
                      <p>{edu.degree}</p>
                    </div>
                  ))}
                </section>
              )}

              {data.skills.technical.length > 0 && (
                <section className="mt-8">
                  <h3 className="text-[8pt] uppercase tracking-[0.2em] text-muted">Skills</h3>
                  <p className="mt-2">{data.skills.technical.join(', ')}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (template === 'professional') {
    return (
      <div className="max-h-[calc(100vh-200px)] overflow-auto rounded-xl bg-gray-200 p-6 dark:bg-dark-bg">
        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
          <div ref={previewRef}>
            <div className="mx-auto bg-white shadow-lg" style={{ width: '210mm', minHeight: '297mm', color: '#212529' }}>
              <header className="bg-charcoal px-8 py-6 text-white">
                <h1 className="text-[24pt] font-bold">{fullName}</h1>
                <p className="mt-1 text-[9pt] opacity-90">{contact.join(' • ')}</p>
              </header>

              <div className="flex">
                <main className="w-[65%] p-7" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10pt', lineHeight: 1.45 }}>
                  {hasText(data.personalInfo.summary) && <Section title="Summary">{data.personalInfo.summary}</Section>}

                  {data.experience.length > 0 && (
                    <Section title="Experience">
                      {data.experience.map((exp) => (
                        <div key={exp.id} className="mb-2">
                          <p className="font-semibold">{exp.company} — {exp.position}</p>
                          <p className="text-[9pt] text-muted">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                        </div>
                      ))}
                    </Section>
                  )}

                  {data.education.length > 0 && (
                    <Section title="Education">
                      {data.education.map((edu) => (
                        <div key={edu.id} className="mb-2">
                          <p className="font-semibold">{edu.institution}</p>
                          <p>{edu.degree}</p>
                        </div>
                      ))}
                    </Section>
                  )}

                  {data.projects.length > 0 && (
                    <Section title="Projects">
                      {data.projects.map((project) => (
                        <div key={project.id} className="mb-2">
                          <p className="font-semibold">{project.name}</p>
                          <p>{project.description}</p>
                        </div>
                      ))}
                    </Section>
                  )}
                </main>

                <aside className="w-[35%] border-l border-gray-200 bg-brand-terracotta/5 p-6" style={{ fontFamily: 'Inter, sans-serif', fontSize: '9pt' }}>
                  {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
                    <section>
                      <h3 className="mb-2 text-[10pt] font-bold uppercase tracking-wide text-brand-terracotta">Skills</h3>
                      {data.skills.technical.map((skill) => (
                        <div key={skill} className="mb-1.5">
                          <p>{skill}</p>
                          <div className="h-1.5 rounded bg-brand-terracotta/20">
                            <div className="h-1.5 rounded bg-brand-terracotta" style={{ width: '75%' }} />
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

                  {data.certifications.length > 0 && (
                    <section className="mt-4">
                      <h3 className="mb-1 text-[10pt] font-bold uppercase tracking-wide text-brand-terracotta">Certifications</h3>
                      {data.certifications.map((cert) => (
                        <p key={cert.id} className="mb-1">{cert.name}</p>
                      ))}
                    </section>
                  )}

                  {data.achievements.length > 0 && (
                    <section className="mt-4">
                      <h3 className="mb-1 text-[10pt] font-bold uppercase tracking-wide text-brand-terracotta">Achievements</h3>
                      {data.achievements.map((achievement) => (
                        <p key={achievement.id} className="mb-1">{achievement.title}</p>
                      ))}
                    </section>
                  )}

                  {data.extraCurricular.length > 0 && (
                    <section className="mt-4">
                      <h3 className="mb-1 text-[10pt] font-bold uppercase tracking-wide text-brand-terracotta">Activities</h3>
                      {data.extraCurricular.map((activity) => (
                        <p key={activity.id} className="mb-1">{activity.activity}</p>
                      ))}
                    </section>
                  )}
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-auto rounded-xl bg-gray-200 p-6 dark:bg-dark-bg">
      <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
        <div ref={previewRef}>
          <div
            className="mx-auto bg-white shadow-lg"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm 15mm',
              fontFamily: 'Inter, sans-serif',
              fontSize: '10pt',
              lineHeight: 1.4,
              color: '#212529',
            }}
          >
            <header className="text-center">
              <h1 className="text-[22pt] font-bold">{fullName}</h1>
              <p className="mt-1 text-[9pt]">{contact.join(' • ')}</p>
            </header>

            <hr className="my-3 border-gray-300" />

            {hasText(data.personalInfo.summary) && (
              <section>
                <p>{data.personalInfo.summary}</p>
              </section>
            )}

            {data.education.length > 0 && (
              <Section title="Education">
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">{edu.institution}</p>
                      <p className="text-[9pt] text-muted">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                    </div>
                    <p>{edu.degree}{edu.grade ? ` | ${edu.grade}` : ''}</p>
                    {edu.highlights.length > 0 && (
                      <ul className="list-disc pl-4">
                        {edu.highlights.map((highlight, index) => (
                          <li key={`${edu.id}-${index}`}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </Section>
            )}

            {data.experience.length > 0 && (
              <Section title="Experience">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="mb-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">{exp.company} | {exp.position}</p>
                      <p className="text-[9pt] text-muted">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    </div>
                    {hasText(exp.location) && <p className="italic">{exp.location}</p>}
                    {exp.description.length > 0 && (
                      <ul className="list-disc pl-4">
                        {exp.description.map((item, index) => (
                          <li key={`${exp.id}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </Section>
            )}

            {data.projects.length > 0 && (
              <Section title="Projects">
                {data.projects.map((project) => (
                  <div key={project.id} className="mb-2">
                    <p className="font-semibold">
                      {project.name}
                      {hasText(project.link) ? ` (${project.link})` : ''}
                    </p>
                    {project.technologies.length > 0 && <p className="italic">{project.technologies.join(', ')}</p>}
                    <p>{project.description}</p>
                  </div>
                ))}
              </Section>
            )}

            {(data.skills.technical.length > 0 || data.skills.tools.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0) && (
              <Section title="Skills">
                {data.skills.technical.length > 0 && <p><strong>Technical:</strong> {data.skills.technical.join(', ')}</p>}
                {data.skills.tools.length > 0 && <p><strong>Tools:</strong> {data.skills.tools.join(', ')}</p>}
                {data.skills.soft.length > 0 && <p><strong>Soft Skills:</strong> {data.skills.soft.join(', ')}</p>}
                {data.skills.languages.length > 0 && <p><strong>Languages:</strong> {data.skills.languages.join(', ')}</p>}
              </Section>
            )}

            {data.certifications.length > 0 && (
              <Section title="Certifications">
                {data.certifications.map((cert) => (
                  <p key={cert.id} className="mb-1">{cert.name} — {cert.issuer} ({cert.date})</p>
                ))}
              </Section>
            )}

            {data.achievements.length > 0 && (
              <Section title="Achievements">
                {data.achievements.map((achievement) => (
                  <p key={achievement.id} className="mb-1"><strong>{achievement.title}:</strong> {achievement.description}</p>
                ))}
              </Section>
            )}

            {data.extraCurricular.length > 0 && (
              <Section title="Activities">
                {data.extraCurricular.map((activity) => (
                  <p key={activity.id} className="mb-1"><strong>{activity.activity}:</strong> {activity.description}</p>
                ))}
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
