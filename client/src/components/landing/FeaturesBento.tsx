"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRightLeft, Award, Briefcase, FileText, Sparkles } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Reveal from "@/components/landing/Reveal";

function MiniRadar() {
  return (
    <svg viewBox="0 0 180 180" className="h-40 w-40">
      <polygon points="90,14 150,50 150,120 90,160 30,120 30,50" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <polygon points="90,34 130,58 132,108 90,136 48,108 50,58" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <polygon points="90,40 138,62 126,112 90,128 56,104 60,62" fill="rgba(254,250,224,0.18)" stroke="#FEFAE0" strokeWidth="2" />
    </svg>
  );
}

function ProgressStripe({ width, color }: { width: string; color: string }) {
  return (
    <div className="h-2.5 rounded-full bg-border dark:bg-dark-border">
      <div className={`h-full rounded-full ${color}`} style={{ width }} />
    </div>
  );
}

export default function FeaturesBento() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.12 });

  const cards = [
    {
      id: "assessment",
      className: "lg:col-span-2 bg-brand-forest text-white",
      content: (
        <>
          <Badge variant="sand">🧠 ML Powered</Badge>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="text-heading-3 text-white">AI Career Assessment</h3>
              <p className="mt-3 text-body text-white/80">
                Scientifically designed assessments based on Holland&apos;s RIASEC model and Big Five personality traits. Get matched to careers with confidence scores and detailed analysis.
              </p>
            </div>
            <MiniRadar />
          </div>
        </>
      ),
    },
    {
      id: "paths",
      className: "bg-surface dark:bg-dark-surface",
      content: (
        <>
          <h3 className="text-heading-4">200+ Career Paths</h3>
          <p className="mt-3 text-body-sm text-slate dark:text-dark-muted">
            From Software Engineering to Culinary Arts. Every career includes salary data, required skills, entrance exams, and a roadmap.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="forest">Engineering</Badge>
            <Badge variant="terracotta">Medical</Badge>
            <Badge variant="sand">Creative</Badge>
          </div>
        </>
      ),
    },
    {
      id: "counsellors",
      className: "bg-surface dark:bg-dark-surface",
      content: (
        <>
          <h3 className="text-heading-4">Expert Counsellors</h3>
          <p className="mt-3 text-body-sm text-slate dark:text-dark-muted">Verified professionals with proven track records.</p>
          <div className="mt-6 flex items-center gap-3">
            <Avatar firstName="Meera" lastName="Iyer" size="md" ring />
            <Avatar firstName="Rahul" lastName="Sethi" size="md" ring className="-ml-3 bg-brand-terracotta" />
            <Avatar firstName="Pallavi" lastName="Deshmukh" size="md" ring className="-ml-3 bg-brand-sand text-charcoal" />
          </div>
          <div className="mt-4 flex items-center gap-1 text-brand-sand">
            {Array.from({ length: 5 }).map((_, index) => (
              <Award key={index} className="h-4 w-4" />
            ))}
          </div>
        </>
      ),
    },
    {
      id: "roadmaps",
      className: "bg-brand-cream dark:bg-dark-elevated",
      content: (
        <>
          <h3 className="text-heading-4">Career Roadmaps</h3>
          <p className="mt-3 text-body-sm text-slate dark:text-dark-muted">Step-by-step paths from Class 9 to your dream career.</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-brand-forest" />
            <span className="h-px flex-1 bg-brand-forest/30" />
            <span className="h-3 w-3 rounded-full bg-brand-terracotta" />
            <span className="h-px flex-1 bg-brand-forest/30" />
            <span className="h-3 w-3 rounded-full bg-brand-sand" />
          </div>
        </>
      ),
    },
    {
      id: "skill-gap",
      className: "bg-surface dark:bg-dark-surface",
      content: (
        <>
          <h3 className="text-heading-4">Skill Gap Analysis</h3>
          <p className="mt-3 text-body-sm text-slate dark:text-dark-muted">Know exactly what you need to learn for your target career.</p>
          <div className="mt-6 space-y-3">
            <ProgressStripe width="78%" color="bg-brand-forest" />
            <ProgressStripe width="56%" color="bg-brand-sand" />
            <ProgressStripe width="34%" color="bg-brand-terracotta" />
          </div>
        </>
      ),
    },
    {
      id: "resume-builder",
      className: "bg-brand-cream dark:bg-dark-elevated",
      content: (
        <>
          <div className="inline-flex rounded-2xl bg-surface p-3 text-brand-forest shadow-soft dark:bg-dark-surface dark:text-brand-mint">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-heading-4">Resume Builder</h3>
          <p className="mt-3 text-body-sm text-slate dark:text-dark-muted">Create ATS-friendly resumes with our guided builder.</p>
        </>
      ),
    },
    {
      id: "comparison",
      className: "lg:col-span-2 bg-brand-sand/20 dark:bg-brand-sand/10",
      content: (
        <>
          <Badge variant="sand">📊 Data Driven</Badge>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h3 className="text-heading-3">Career Comparison Tool</h3>
              <p className="mt-3 text-body-sm text-slate dark:text-dark-muted">
                Can&apos;t decide between two careers? Compare them side-by-side across salary, growth, skills, work-life balance, and more. Make data-driven decisions, not emotional ones.
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl bg-surface p-4 shadow-card dark:bg-dark-surface">
                <div className="flex items-center gap-2 text-brand-forest"><Briefcase className="h-4 w-4" /><span className="text-body-sm font-semibold">UX Designer</span></div>
                <p className="mt-3 font-mono text-xl text-charcoal dark:text-dark-text">₹5L - ₹22L</p>
                <p className="mt-2 text-caption text-muted dark:text-dark-muted">High creativity • Strong growth</p>
              </div>
              <div className="rounded-2xl bg-surface p-4 shadow-card dark:bg-dark-surface">
                <div className="flex items-center gap-2 text-brand-terracotta"><ArrowRightLeft className="h-4 w-4" /><span className="text-body-sm font-semibold">Product Manager</span></div>
                <p className="mt-3 font-mono text-xl text-charcoal dark:text-dark-text">₹8L - ₹35L</p>
                <p className="mt-2 text-caption text-muted dark:text-dark-muted">Leadership • Market depth</p>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <section className="bg-brand-cream py-20 dark:bg-dark-bg md:py-28 lg:py-32">
      <div className="section-container" ref={ref}>
        <Reveal>
          <div className="flex items-center gap-3 text-brand-forest dark:text-brand-mint">
            <Sparkles className="h-5 w-5" />
            <span className="text-body-sm font-semibold uppercase tracking-[0.18em]">Platform Features</span>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-4 max-w-3xl">
          <h2 className="section-title">Everything students need, arranged around real decisions.</h2>
        </Reveal>
        <Reveal delay={0.2} className="mt-5 max-w-2xl">
          <p className="section-subtitle">The product spans assessments, guidance, planning, and exploration without losing warmth or clarity.</p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 26 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
              transition={{ duration: 0.55, delay: 0.25 + index * 0.1, ease: "easeOut" }}
              className={card.className}
            >
              <Card className={`h-full rounded-2xl p-6 md:p-8 ${card.className} transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}>
                {card.content}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}