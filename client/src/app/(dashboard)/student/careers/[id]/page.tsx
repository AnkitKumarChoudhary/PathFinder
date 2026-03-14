'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftRight, FileText, GraduationCap, IndianRupee, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { CareerCard } from '@/components/features/careers/CareerCard'
import { CareerRoadmap } from '@/components/features/careers/CareerRoadmap'
import { SaveCareerButton } from '@/components/features/careers/SaveCareerButton'
import { useCareer, useRelatedCareers } from '@/hooks/useCareer'
import { formatSalary } from '@/lib/format-salary'

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
      <Icon className="h-4 w-4 text-white/60" />
      <p className="mt-2 text-xs uppercase text-white/60">{label}</p>
      <p className="font-mono text-lg font-semibold text-white">{value}</p>
    </div>
  )
}

export default function CareerDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const { data: career, isLoading } = useCareer(id)
  const { data: relatedCareers = [] } = useRelatedCareers(id)

  if (isLoading || !career) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div>
      <nav className="mb-6 text-sm text-muted dark:text-dark-muted">
        Home &gt; Careers &gt; {career.category} &gt; {career.title}
      </nav>

      <div className="rounded-2xl bg-gradient-forest p-8 text-white md:p-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <Badge className="bg-white/20 text-white" size="sm">{career.category}</Badge>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">{career.title}</h1>
            <p className="mt-3 max-w-2xl text-white/80">{career.description.split('. ')[0]}.</p>
          </div>

          <div className="flex gap-3">
            <SaveCareerButton careerId={id} isSaved={!!career.isSaved} size="lg" showLabel />
            <button
              onClick={() => router.push(`/student/careers/compare?ids=${career.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                border border-white/30 text-white hover:bg-white/10
                font-medium text-sm transition-colors"
            >
              <ArrowLeftRight size={16} />
              Compare
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={IndianRupee} label="Avg. Salary" value={formatSalary(career.averageSalary)} />
          <StatCard icon={TrendingUp} label="Growth" value={career.growthOutlook || 'N/A'} />
          <StatCard icon={GraduationCap} label="Education" value={career.educationPath || 'N/A'} />
          <StatCard icon={FileText} label="Top Exam" value={career.popularExams[0] || 'N/A'} />
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-heading text-heading-2">About This Career</h2>
        <div className="mt-4 space-y-3 text-slate dark:text-gray-300">
          {career.description
            .split(/\n|\.\s+/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph.endsWith('.') ? paragraph : `${paragraph}.`}
              </p>
            ))}
        </div>
      </section>

      {career.dayInLife ? (
        <section className="mt-12 rounded-2xl bg-brand-mint/10 p-8 dark:bg-brand-forest/10">
          <h2 className="font-heading text-heading-3">☀️ A Day in the Life</h2>
          <p className="mt-3 italic leading-relaxed text-slate dark:text-gray-300">{career.dayInLife}</p>
        </section>
      ) : null}

      {career.roadmap ? (
        <section className="mt-12">
          <h2 className="font-heading text-heading-2">Your Roadmap</h2>
          <p className="mt-2 text-slate dark:text-gray-400">
            Here&apos;s a step-by-step path to becoming a {career.title}
          </p>
          <div className="mt-8">
            <CareerRoadmap roadmap={career.roadmap} />
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-heading text-heading-2">Skills You&apos;ll Need</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {career.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-brand-sage/20 bg-brand-cream px-4 py-2 text-sm font-medium text-brand-forest dark:bg-dark-surface dark:text-brand-mint"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
          <h3 className="font-heading text-heading-4">Top Colleges</h3>
          <ul className="mt-4 space-y-3">
            {career.topColleges.map((college) => (
              <li key={college} className="flex items-center gap-2 text-sm text-slate dark:text-gray-300">
                <GraduationCap className="h-4 w-4 text-brand-sage" /> {college}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 dark:border-dark-border dark:bg-dark-surface">
          <h3 className="font-heading text-heading-4">Entrance Exams</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {career.popularExams.map((exam) => (
              <span key={exam} className="rounded-full bg-brand-forest/10 px-3 py-1 text-sm text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint">
                {exam}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-heading-2">Industries</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {career.industries.map((industry) => (
            <span key={industry} className="rounded-full bg-brand-sand/20 px-3 py-1 text-sm text-charcoal dark:bg-dark-elevated dark:text-dark-text">
              {industry}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-heading-2">Related Careers</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedCareers.map((related) => (
            <CareerCard key={related.id} career={related} variant="compact" />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-gradient-forest p-10 text-center text-white">
        <h2 className="font-heading text-heading-2 text-white">Ready to pursue this career?</h2>
        <p className="mt-2 text-white/80">
          Take our AI-powered assessment to see if this career matches your strengths.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/student/assessments">
            <Button className="bg-brand-terracotta hover:brightness-110">Take Career Assessment</Button>
          </Link>
          <Link href="/student/mentorship">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-charcoal">
              Talk to a Mentor
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
