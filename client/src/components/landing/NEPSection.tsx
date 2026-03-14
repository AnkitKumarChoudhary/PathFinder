"use client";

import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Reveal from "@/components/landing/Reveal";

const points = [
  "Aptitude-based career selection over societal pressure",
  "Exposure to 200+ career paths including vocational options",
  "Multidisciplinary exploration from Class 9 onwards",
  "Accessible to students in Tier-2, Tier-3 cities and rural areas",
];

export default function NEPSection() {
  return (
    <section className="bg-brand-forest/5 py-20 dark:bg-brand-forest/10 md:py-28 lg:py-32">
      <div className="section-container grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div>
          <Reveal>
            <Badge variant="forest">🏛️ Policy Aligned</Badge>
          </Reveal>
          <Reveal delay={0.1} className="mt-5">
            <h2 className="section-title">Built on the Vision of NEP 2020</h2>
          </Reveal>
          <Reveal delay={0.2} className="mt-5 max-w-2xl">
            <p className="text-body-lg text-slate dark:text-dark-muted">
              The National Education Policy 2020 mandates integration of career counselling in schools from the secondary level onwards. PathFinder brings this vision to life through technology.
            </p>
          </Reveal>
          <div className="mt-8 space-y-4">
            {points.map((point, index) => (
              <Reveal key={point} delay={0.3 + index * 0.1}>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-forest dark:text-brand-mint" />
                  <p className="text-body text-charcoal dark:text-dark-text">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.4}>
          <Card className="relative overflow-hidden rounded-2xl p-8 shadow-elevated">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            <span className="absolute left-6 top-10 font-serif text-7xl leading-none text-brand-forest/10 dark:text-brand-mint/10">“</span>
            <blockquote className="relative pt-10 text-heading-3 text-charcoal dark:text-dark-text">
              Career counselling and mentoring sessions shall be made available to all students at the secondary school level.
            </blockquote>
            <p className="mt-6 text-body text-muted dark:text-dark-muted">National Education Policy 2020, Section 22.2</p>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}