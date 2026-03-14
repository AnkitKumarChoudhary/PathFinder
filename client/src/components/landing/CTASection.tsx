"use client";

import Link from "next/link";

import Reveal from "@/components/landing/Reveal";

export default function CTASection() {
  return (
    <section className="overflow-hidden bg-gradient-forest text-white">
      <div className="relative rounded-t-3xl py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.06),transparent_22%)]" />
        <div className="section-container relative">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h2 className="font-heading text-display font-bold tracking-[-0.03em] text-white md:text-display-lg">
                Ready to Find Your Path?
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-5">
              <p className="text-body-lg text-white/80">
                Join thousands of students making confident, informed career decisions. Your 10-minute assessment is free, forever.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-terracotta px-10 py-4 text-body-lg font-medium text-white transition-all duration-200 ease-smooth hover:scale-[1.02] hover:brightness-110 hover:shadow-glow-terracotta active:scale-[0.98]"
              >
                Start Your Free Assessment →
              </Link>
            </Reveal>
            <Reveal delay={0.3} className="mt-4">
              <p className="text-body-sm text-white/50">No sign-up required to try • Takes only 10 minutes</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}