"use client";

import * as React from "react";
import { useInView } from "framer-motion";

function useCountUp(target: number, start: boolean, duration = 2000) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!start) return undefined;

    let frame = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, start, target]);

  return value;
}

function StatItem({ target, suffix, label, start }: { target: number; suffix: string; label: string; start: boolean }) {
  const value = useCountUp(target, start);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-5 text-center md:px-8">
      <p className="font-mono text-5xl font-bold text-brand-sand md:text-6xl">
        {value}
        {suffix}
      </p>
      <p className="mt-2 text-body text-white/60">{label}</p>
    </div>
  );
}

export default function StatsCounter() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="bg-charcoal py-16 text-white md:py-20">
      <div className="section-container" ref={ref}>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
          {[
            { target: 10, suffix: ",000+", label: "Students Guided" },
            { target: 200, suffix: "+", label: "Career Paths" },
            { target: 50, suffix: "+", label: "Expert Counsellors" },
            { target: 95, suffix: "%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label} className="xl:border-r xl:border-white/10 last:xl:border-r-0">
              <StatItem target={stat.target} suffix={stat.suffix} label={stat.label} start={isInView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}