import { motion } from 'framer-motion'
import { RoadmapStep } from '@/types/career'

interface CareerRoadmapProps {
  roadmap: unknown
}

export function CareerRoadmap({ roadmap }: CareerRoadmapProps) {
  let parsed: unknown = roadmap
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      return null
    }
  }

  let steps: RoadmapStep[] = []
  if (Array.isArray(parsed)) {
    steps = parsed as RoadmapStep[]
  } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as { steps?: unknown }).steps)) {
    steps = (parsed as { steps: RoadmapStep[] }).steps
  }

  if (!steps.length) {
    return null
  }

  return (
    <div className="relative py-8">
      <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-brand-sage/30 md:left-1/2" />

      <div className="space-y-8 md:hidden">
        {steps.map((step, index) => (
          <motion.div
            key={`${step.year}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-16"
          >
            <div className="absolute left-6 top-1 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-brand-terracotta text-lg text-white">
              {step.icon || '•'}
            </div>
            <p className="font-mono text-sm font-medium text-brand-forest dark:text-brand-mint">{step.year}</p>
            <div className="mt-2 rounded-lg border border-gray-100 bg-white p-5 shadow-soft dark:border-dark-border dark:bg-dark-surface">
              <h4 className="font-heading font-semibold text-charcoal dark:text-dark-text">{step.title}</h4>
              <p className="mt-1 text-sm text-slate dark:text-gray-400">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="hidden space-y-12 md:block">
        {steps.map((step, index) => {
          const isEven = index % 2 === 0
          return (
            <motion.div
              key={`${step.year}-${index}`}
              initial={{ opacity: 0, x: isEven ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex items-center"
            >
              <div className="w-[calc(50%-20px)] text-right">
                {isEven ? (
                  <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-soft dark:border-dark-border dark:bg-dark-surface">
                    <h4 className="font-heading font-semibold text-charcoal dark:text-dark-text">{step.title}</h4>
                    <p className="mt-1 text-sm text-slate dark:text-gray-400">{step.description}</p>
                  </div>
                ) : (
                  <p className="font-mono text-sm font-medium text-brand-forest dark:text-brand-mint">{step.year}</p>
                )}
              </div>

              <div className="absolute left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-brand-terracotta text-lg text-white">
                {step.icon || '•'}
              </div>

              <div className="ml-auto w-[calc(50%-20px)]">
                {isEven ? (
                  <p className="font-mono text-sm font-medium text-brand-forest dark:text-brand-mint">{step.year}</p>
                ) : (
                  <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-soft dark:border-dark-border dark:bg-dark-surface">
                    <h4 className="font-heading font-semibold text-charcoal dark:text-dark-text">{step.title}</h4>
                    <p className="mt-1 text-sm text-slate dark:text-gray-400">{step.description}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
