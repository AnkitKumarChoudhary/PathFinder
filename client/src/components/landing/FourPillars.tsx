"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Brain, Compass, Users } from "lucide-react";

import { Card } from "@/components/ui/Card";
import Reveal from "@/components/landing/Reveal";

const pillars = [
  {
    number: "01",
    title: "AI-Powered Career Guidance",
    description:
      "Our machine learning engine analyzes your aptitude, personality traits (Big Five), and interests (RIASEC model) to recommend careers that truly fit who you are, not what society expects.",
    detail: "Powered by KNN + Random Forest algorithms",
    icon: Brain,
    accent: "border-l-brand-forest",
    iconClass: "bg-brand-forest/10 text-brand-forest dark:bg-brand-forest/20 dark:text-brand-mint",
  },
  {
    number: "02",
    title: "1-on-1 Career Mentorship",
    description:
      "Connect with verified professionals, from IIT professors to industry leaders, for personalized guidance sessions. Get real-world insights no textbook can provide.",
    detail: "Mentors from academia, industry, and startups",
    icon: Users,
    accent: "border-l-brand-terracotta",
    iconClass: "bg-brand-terracotta/10 text-brand-terracotta dark:bg-brand-terracotta/20 dark:text-brand-terracotta",
  },
  {
    number: "03",
    title: "Interactive Career Exploration",
    description:
      "Explore 200+ career paths through interactive roadmaps, 'Day in the Life' stories, salary visualizations, and skill gap analysis. Make decisions based on data, not assumptions.",
    detail: "Built for streams, vocational tracks, and emerging fields",
    icon: Compass,
    accent: "border-l-brand-sand",
    iconClass: "bg-brand-sand/15 text-brand-sand dark:bg-brand-sand/20 dark:text-brand-sand",
  },
  {
    number: "04",
    title: "Comprehensive Resource Portal",
    description:
      "Access curated articles, video guides, online courses, scholarship databases, and entrance exam strategies, all organized by career path and education level.",
    detail: "Updated for Indian institutions, exams, and scholarships",
    icon: BookOpen,
    accent: "border-l-status-info",
    iconClass: "bg-status-info/10 text-status-info dark:bg-status-info/20 dark:text-status-info",
  },
];

export default function FourPillars() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="relative overflow-hidden bg-brand-cream py-20 dark:bg-dark-bg md:py-28 lg:py-32">
      <div className="absolute inset-0 bg-dots opacity-50" />
      <div className="section-container relative" ref={ref}>
        <Reveal>
          <h2 className="section-title text-center">Our Four Pillars of Guidance</h2>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-5 max-w-3xl text-center">
          <p className="section-subtitle max-w-none">
            Aligned with NEP 2020&apos;s vision of holistic career development, our platform addresses the guidance gap through four integrated approaches.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 26 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
              >
                <Card
                  variant="interactive"
                  className={`relative overflow-hidden border-l-4 ${pillar.accent} p-8 hover:-translate-y-1 hover:shadow-card-hover`}
                >
                  <span className="pointer-events-none absolute right-5 top-3 font-mono text-7xl font-bold text-charcoal/10 dark:text-dark-text/10">
                    {pillar.number}
                  </span>
                  <div className={`inline-flex rounded-2xl p-3 ${pillar.iconClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 max-w-sm text-heading-3">{pillar.title}</h3>
                  <p className="mt-4 text-body text-slate dark:text-dark-muted">{pillar.description}</p>
                  <p className="mt-6 text-caption font-medium uppercase tracking-[0.16em] text-muted dark:text-dark-muted">
                    {pillar.detail}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}