"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ClipboardCheck, MessageCircle, Search } from "lucide-react";

import { Card } from "@/components/ui/Card";
import Reveal from "@/components/landing/Reveal";

const steps = [
  {
    number: "01",
    eyebrow: "Discover Yourself",
    title: "Take the Assessment",
    description:
      "Complete our 10-minute AI-powered assessment covering aptitude, personality, and interests. Based on Holland's RIASEC model and the Big Five framework.",
    detail: "⏱️ 10 minutes",
    icon: ClipboardCheck,
    iconClass: "bg-brand-forest text-white",
  },
  {
    number: "02",
    eyebrow: "Explore Your Matches",
    title: "Get Career Recommendations",
    description:
      "Receive a personalized list of matching careers with fit scores, salary data, required skills, and step-by-step roadmaps. Compare options side-by-side.",
    detail: "📊 Personalized for you",
    icon: Search,
    iconClass: "bg-brand-terracotta text-white",
  },
  {
    number: "03",
    eyebrow: "Get Expert Guidance",
    title: "Connect with a Counsellor",
    description:
      "Book a 1-on-1 session with a verified career counsellor. Discuss your results, clear your doubts, and create an action plan for your future.",
    detail: "🎯 Verified experts only",
    icon: MessageCircle,
    iconClass: "bg-brand-sand text-charcoal",
  },
];

export default function HowItWorks() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="bg-surface py-20 dark:bg-dark-surface md:py-28 lg:py-32">
      <div className="section-container" ref={ref}>
        <Reveal>
          <h2 className="section-title text-left">How PathFinder Works</h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-5 max-w-2xl">
          <p className="section-subtitle">From confusion to clarity in three simple steps.</p>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute left-7 top-12 h-[calc(100%-6rem)] w-px border-l border-dashed border-brand-forest/30 md:hidden" />
          <div className="absolute left-[12%] right-[12%] top-10 hidden border-t border-dashed border-brand-forest/30 lg:block" />

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.2, ease: "easeOut" }}
                >
                  <Card className="relative h-full p-8">
                    <p className="font-mono text-6xl font-bold leading-none text-brand-forest/10">{step.number}</p>
                    <div className={`mt-5 inline-flex h-14 w-14 items-center justify-center rounded-full ${step.iconClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-6 text-caption font-semibold uppercase tracking-[0.18em] text-muted dark:text-dark-muted">
                      {step.eyebrow}
                    </p>
                    <h3 className="mt-2 text-heading-3">{step.title}</h3>
                    <p className="mt-4 text-body text-slate dark:text-dark-muted">{step.description}</p>
                    <p className="mt-6 text-body-sm font-medium text-brand-forest dark:text-brand-mint">{step.detail}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}