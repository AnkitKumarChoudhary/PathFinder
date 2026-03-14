"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";

const institutions = [
  "IIT Delhi",
  "IIT Bombay",
  "NIT Trichy",
  "BITS Pilani",
  "Delhi University",
  "St. Stephen's",
  "Christ University",
  "Kendriya Vidyalaya",
  "DPS Schools",
  "DAV Schools",
  "Navodaya Vidyalaya",
  "Army Public School",
];

export default function TrustedByBar() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="overflow-hidden border-y border-border/30 bg-surface py-12 dark:border-dark-border dark:bg-dark-surface">
      <div className="section-container" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center text-caption font-medium uppercase tracking-[0.25em] text-muted dark:text-dark-muted"
        >
          Empowering students from India&apos;s top institutions
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          className="group relative mt-8 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex min-w-max gap-4 group-hover:[animation-play-state:paused] animate-marquee">
            {[...institutions, ...institutions].map((institution, index) => (
              <span
                key={`${institution}-${index}`}
                className="inline-flex rounded-full bg-brand-cream px-6 py-2 text-body-sm font-medium text-slate dark:bg-dark-elevated dark:text-dark-text"
              >
                {institution}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}