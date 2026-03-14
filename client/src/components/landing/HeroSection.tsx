"use client";

import Link from "next/link";
import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock3, Compass, Star } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import Reveal from "@/components/landing/Reveal";
import { cn } from "@/lib/utils";

function RadarPreview() {
  return (
    <svg viewBox="0 0 200 200" className="h-32 w-32 text-brand-forest/20">
      <polygon points="100,20 170,65 145,150 55,150 30,65" fill="none" stroke="currentColor" strokeWidth="2" />
      <polygon points="100,40 152,74 134,136 66,136 48,74" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="100,58 137,82 124,126 76,126 63,82" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon
        points="100,48 146,76 124,122 82,132 58,84"
        fill="rgba(231,111,81,0.18)"
        stroke="#E76F51"
        strokeWidth="2"
      />
      <line x1="100" y1="20" x2="100" y2="150" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="65" x2="170" y2="65" stroke="currentColor" strokeWidth="1" />
      <line x1="55" y1="150" x2="145" y2="150" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function FloatingCard({
  children,
  className,
  isInView,
  delay = 0,
  duration = 3,
}: {
  children: React.ReactNode;
  className?: string;
  isInView: boolean;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: [0, -8, 0],
              scale: 1,
            }
          : { opacity: 0, y: 28, scale: 0.96 }
      }
      transition={{
        opacity: { duration: 0.55, delay, ease: "easeOut" },
        scale: { duration: 0.55, delay, ease: "easeOut" },
        y: { duration, delay, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection() {
  const cardsRef = React.useRef<HTMLDivElement | null>(null);
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.25 });

  return (
    <section className="relative overflow-hidden bg-brand-cream pt-10 dark:bg-dark-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(149,213,178,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(212,163,115,0.18),transparent_30%)]" />
      <div className="section-container section-padding relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="max-w-2xl">
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-forest/10 px-4 py-1.5 text-body-sm font-medium text-brand-forest dark:bg-brand-forest/20 dark:text-brand-mint">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-forest dark:bg-brand-mint" />
                <span>🎓 Trusted by 10,000+ students across India</span>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-6">
              <h1 className="font-heading text-display font-bold tracking-[-0.03em] text-charcoal dark:text-dark-text md:text-display-lg xl:text-display-xl">
                Figure Out Your
                <br />
                <span className="relative mt-2 inline-block rounded-2xl bg-brand-sand/30 px-2 py-1 text-charcoal -rotate-1 dark:text-dark-text">
                  Next Big Move.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.3} className="mt-6 max-w-lg">
              <p className="text-body-lg text-slate dark:text-dark-muted">
                India&apos;s first AI-powered career guidance platform for schools. Take a 10-minute assessment, get a personalized career roadmap, and connect with expert counsellors, all in one place.
              </p>
            </Reveal>

            <Reveal delay={0.4} className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-terracotta px-8 py-3 text-body-lg font-medium text-white shadow-soft transition-all duration-200 ease-smooth hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
              >
                Take Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/careers"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-charcoal px-8 py-3 text-body-lg font-medium text-charcoal transition-all duration-200 ease-smooth hover:scale-[1.02] hover:bg-charcoal hover:text-white active:scale-[0.98] dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-text dark:hover:text-dark-bg"
              >
                Explore Careers
                <Compass className="h-5 w-5" />
              </Link>
            </Reveal>

            <Reveal delay={0.5} className="mt-8 flex items-center gap-4">
              <div className="flex items-center">
                {[
                  { firstName: "Priya", lastName: "Sharma", className: "bg-brand-forest" },
                  { firstName: "Aman", lastName: "Khan", className: "-ml-2 bg-brand-terracotta" },
                  { firstName: "Rhea", lastName: "Verma", className: "-ml-2 bg-brand-sand text-charcoal" },
                  { firstName: "Sana", lastName: "Dutta", className: "-ml-2 bg-brand-sage" },
                ].map((student) => (
                  <div key={`${student.firstName}-${student.lastName}`} className={student.className.startsWith("-") ? student.className.split(" ")[0] : undefined}>
                    <Avatar
                      firstName={student.firstName}
                      lastName={student.lastName}
                      size="sm"
                      ring
                      className={cn(student.className.replace("-ml-2 ", ""))}
                    />
                  </div>
                ))}
              </div>
              <p className="text-body-sm text-muted dark:text-dark-muted">Join 2,400+ students this month</p>
            </Reveal>
          </div>

          <div ref={cardsRef} className="relative min-h-[520px] lg:min-h-[560px]">
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              <FloatingCard isInView={cardsInView} duration={3}>
                <Card className="rotate-1 p-4">
                  <p className="text-body-sm font-semibold text-charcoal dark:text-dark-text">Career Match</p>
                  <div className="mt-4 flex items-center gap-4">
                    <RadarPreview />
                    <div>
                      <p className="text-body-sm text-muted dark:text-dark-muted">Your RIASEC Profile</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="forest" size="sm">Investigative</Badge>
                        <Badge variant="terracotta" size="sm">Artistic</Badge>
                        <Badge variant="sand" size="sm">Social</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </FloatingCard>
              <FloatingCard isInView={cardsInView} delay={0.2} duration={3.5}>
                <Card className="-rotate-2 p-4">
                  <p className="text-heading-4">Software Engineer</p>
                  <p className="mt-2 font-mono text-2xl text-brand-forest dark:text-brand-mint">₹6L - ₹35L per annum</p>
                  <Badge variant="forest" className="mt-4">High Demand 🔥</Badge>
                </Card>
              </FloatingCard>
              <FloatingCard isInView={cardsInView} delay={0.4} duration={4}>
                <Card className="rotate-2 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar firstName="Meera" lastName="Nair" size="md" className="bg-brand-terracotta" />
                    <div>
                      <p className="text-body-sm font-semibold text-charcoal dark:text-dark-text">Dr. Meera Nair</p>
                      <div className="mt-1 flex items-center gap-1 text-brand-sand">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="mt-1 text-caption text-muted dark:text-dark-muted">12 yrs experience</p>
                    </div>
                  </div>
                </Card>
              </FloatingCard>
              <FloatingCard isInView={cardsInView} delay={0.3} duration={3.2}>
                <Card className="-rotate-1 p-4">
                  <p className="text-body-sm font-semibold text-charcoal dark:text-dark-text">Career Aptitude Test</p>
                  <ProgressBar value={73} className="mt-4" />
                  <div className="mt-3 flex items-center justify-between text-body-sm text-muted dark:text-dark-muted">
                    <span>18 of 30 questions</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />12 min remaining</span>
                  </div>
                </Card>
              </FloatingCard>
            </div>

            <div className="relative hidden h-full lg:block">
              <FloatingCard isInView={cardsInView} duration={3} className="absolute left-0 top-2 w-[58%]">
                <Card className="rotate-2 p-5">
                  <p className="text-heading-4">Career Match</p>
                  <div className="mt-4 flex items-center gap-4">
                    <RadarPreview />
                    <div>
                      <p className="text-body-sm text-muted dark:text-dark-muted">Your RIASEC Profile</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="forest" size="sm">Investigative</Badge>
                        <Badge variant="terracotta" size="sm">Artistic</Badge>
                        <Badge variant="sand" size="sm">Social</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </FloatingCard>

              <FloatingCard isInView={cardsInView} delay={0.2} duration={3.5} className="absolute right-0 top-10 w-[40%]">
                <Card className="-rotate-2 p-5">
                  <p className="text-body-sm text-muted dark:text-dark-muted">Salary Preview</p>
                  <p className="mt-2 text-heading-4">Software Engineer</p>
                  <p className="mt-2 font-mono text-2xl text-brand-forest dark:text-brand-mint">₹6L - ₹35L per annum</p>
                  <Badge variant="forest" className="mt-4">High Demand 🔥</Badge>
                </Card>
              </FloatingCard>

              <FloatingCard isInView={cardsInView} delay={0.4} duration={4} className="absolute bottom-16 left-8 w-[36%]">
                <Card className="rotate-3 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar firstName="Meera" lastName="Nair" size="md" className="bg-brand-terracotta" />
                    <div>
                      <p className="text-body-sm font-semibold text-charcoal dark:text-dark-text">Dr. Meera Nair</p>
                      <div className="mt-1 flex items-center gap-1 text-brand-sand">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="mt-1 text-caption text-muted dark:text-dark-muted">12 yrs experience</p>
                    </div>
                  </div>
                </Card>
              </FloatingCard>

              <FloatingCard isInView={cardsInView} delay={0.3} duration={3.2} className="absolute bottom-0 right-6 w-[46%]">
                <Card className="-rotate-1 p-5">
                  <p className="text-body-sm font-semibold text-charcoal dark:text-dark-text">Career Aptitude Test</p>
                  <ProgressBar value={73} className="mt-4" />
                  <div className="mt-3 flex items-center justify-between text-body-sm text-muted dark:text-dark-muted">
                    <span>18 of 30 questions</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />12 min remaining</span>
                  </div>
                </Card>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}