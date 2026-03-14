import Link from 'next/link'
import { Career } from '@/types/career'
import { cn } from '@/lib/utils'
import { formatSalary } from '@/lib/format-salary'

interface ComparisonTableProps {
  careers: Career[]
}

function parseSalaryValue(salary: Career['averageSalary']) {
  if (!salary) return 0
  const formatted = formatSalary(salary)
  const matches = formatted.match(/\d+(?:\.\d+)?/g)
  if (!matches) return 0
  const nums = matches.map(Number)
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function growthBadge(growth: string | null) {
  const value = (growth || '').toLowerCase()
  if (value.includes('high')) return 'bg-status-success/10 text-status-success'
  if (value.includes('moderate')) return 'bg-status-warning/20 text-charcoal dark:text-status-warning'
  if (value.includes('stable')) return 'bg-status-info/10 text-status-info'
  return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
}

const attributes = [
  'Average Salary',
  'Growth Outlook',
  'Education Path',
  'Key Entrance Exams',
  'Top Colleges',
  'Key Skills',
  'Industries',
  'Day in Life',
]

export function ComparisonTable({ careers }: ComparisonTableProps) {
  const salaryScores = careers.map((career) => parseSalaryValue(career.averageSalary))
  const maxSalary = Math.max(...salaryScores, 0)

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-gray-100 md:block dark:border-dark-border">
        <table className="min-w-full border-collapse">
          <thead className="bg-brand-forest text-white">
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-brand-forest px-4 py-3 text-left font-heading">Attribute</th>
              {careers.map((career) => (
                <th key={career.id} className="px-4 py-3 text-left">
                  <p className="font-heading text-base">{career.title}</p>
                  <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs">{career.category}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attribute, rowIndex) => (
              <tr key={attribute} className={rowIndex % 2 === 0 ? 'bg-brand-cream/50 dark:bg-dark-surface' : 'bg-white dark:bg-dark-elevated'}>
                <td className="sticky left-0 z-10 w-40 bg-inherit px-4 py-3 text-sm font-medium text-charcoal dark:text-dark-text">{attribute}</td>
                {careers.map((career) => {
                  if (attribute === 'Average Salary') {
                    const isHighest = parseSalaryValue(career.averageSalary) === maxSalary && maxSalary > 0
                    return (
                      <td key={`${career.id}-${attribute}`} className={cn('px-4 py-3 text-sm', isHighest && 'bg-brand-forest/10 text-brand-forest dark:text-brand-mint')}>
                        {formatSalary(career.averageSalary)}
                      </td>
                    )
                  }

                  if (attribute === 'Growth Outlook') {
                    return (
                      <td key={`${career.id}-${attribute}`} className="px-4 py-3 text-sm">
                        <span className={cn('rounded-full px-2 py-1 text-xs', growthBadge(career.growthOutlook))}>
                          {career.growthOutlook || 'N/A'}
                        </span>
                      </td>
                    )
                  }

                  if (attribute === 'Education Path') {
                    return <td key={`${career.id}-${attribute}`} className="px-4 py-3 text-sm">{career.educationPath || 'N/A'}</td>
                  }

                  if (attribute === 'Key Entrance Exams') {
                    return (
                      <td key={`${career.id}-${attribute}`} className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {career.popularExams.slice(0, 4).map((exam) => (
                            <span key={exam} className="rounded-full bg-brand-mint/20 px-2 py-0.5 text-xs text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint">
                              {exam}
                            </span>
                          ))}
                        </div>
                      </td>
                    )
                  }

                  if (attribute === 'Top Colleges') {
                    const colleges = career.topColleges.slice(0, 3)
                    const remaining = Math.max(career.topColleges.length - 3, 0)
                    return (
                      <td key={`${career.id}-${attribute}`} className="px-4 py-3 text-sm">
                        {colleges.join(', ')}
                        {remaining > 0 ? ` and ${remaining} more` : ''}
                      </td>
                    )
                  }

                  if (attribute === 'Key Skills') {
                    return (
                      <td key={`${career.id}-${attribute}`} className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {career.skills.slice(0, 5).map((skill) => (
                            <span key={skill} className="rounded-full bg-brand-cream px-2 py-0.5 text-xs text-charcoal dark:bg-dark-border dark:text-dark-text">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                    )
                  }

                  if (attribute === 'Industries') {
                    return <td key={`${career.id}-${attribute}`} className="px-4 py-3 text-sm">{career.industries.join(', ') || 'N/A'}</td>
                  }

                  return (
                    <td key={`${career.id}-${attribute}`} className="px-4 py-3 text-sm">
                      {career.dayInLife ? `${career.dayInLife.slice(0, 100)}... ` : 'N/A'}
                      {career.dayInLife ? (
                        <Link href={`/student/careers/${career.id}`} className="text-brand-forest hover:underline dark:text-brand-mint">
                          Read more
                        </Link>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {careers.map((career) => (
          <div key={career.id} className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
            <h3 className="font-heading text-lg text-charcoal dark:text-dark-text">{career.title}</h3>
            <p className="mt-1 text-xs text-muted dark:text-dark-muted">{career.category}</p>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-medium">Average Salary:</span> {formatSalary(career.averageSalary)}</p>
              <p><span className="font-medium">Growth Outlook:</span> {career.growthOutlook || 'N/A'}</p>
              <p><span className="font-medium">Education Path:</span> {career.educationPath || 'N/A'}</p>
              <p><span className="font-medium">Exams:</span> {career.popularExams.join(', ') || 'N/A'}</p>
              <p><span className="font-medium">Top Colleges:</span> {career.topColleges.slice(0, 3).join(', ') || 'N/A'}</p>
              <p><span className="font-medium">Skills:</span> {career.skills.slice(0, 5).join(', ') || 'N/A'}</p>
              <p><span className="font-medium">Industries:</span> {career.industries.join(', ') || 'N/A'}</p>
              <p><span className="font-medium">Day in Life:</span> {career.dayInLife ? `${career.dayInLife.slice(0, 120)}...` : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
