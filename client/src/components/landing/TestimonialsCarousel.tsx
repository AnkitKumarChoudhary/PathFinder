"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { Card } from "@/components/ui/Card";
import Reveal from "@/components/landing/Reveal";

const testimonials = [
  {
    quote:
      "PathFinder's assessment helped me realize my strength in investigative thinking. I was blindly preparing for JEE, but now I'm pursuing Biotechnology and loving every minute of it.",
    name: "Ananya Krishnan",
    details: "Class 12, Kendriya Vidyalaya, Chennai",
    rating: 5,
  },
  {
    quote:
      "My parents wanted me to become a doctor, but the counsellor session helped my family understand that my aptitude lies in design. I'm now at NID Ahmedabad.",
    name: "Rohit Saxena",
    details: "1st Year B.Des, NID Ahmedabad",
    rating: 5,
  },
  {
    quote:
      "I had no idea there were so many career options in commerce beyond CA. The career comparison tool opened my eyes to fields like fintech and investment banking.",
    name: "Meghna Agarwal",
    details: "Class 11 Commerce, DPS Noida",
    rating: 4,
  },
  {
    quote:
      "As a first-generation college student from a small town, I had zero guidance. PathFinder gave me the roadmap I desperately needed.",
    name: "Suresh Yadav",
    details: "Class 12, Government School, Jaipur",
    rating: 5,
  },
  {
    quote:
      "The resume builder helped me create a professional CV for my internship applications. I got shortlisted at 3 companies!",
    name: "Ishita Mehta",
    details: "B.Tech 3rd Year, VIT Vellore",
    rating: 4,
  },
  {
    quote:
      "Dr. Meera Nair's counselling session was the best 30 minutes I've spent. She helped me map out a clear 5-year plan.",
    name: "Aditya Banerjee",
    details: "Class 12 Science, South Point School, Kolkata",
    rating: 5,
  },
];

function getVisibleSlides(width: number) {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
}

export default function TestimonialsCarousel() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visibleSlides, setVisibleSlides] = React.useState(3);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    const updateVisibleSlides = () => setVisibleSlides(getVisibleSlides(window.innerWidth));
    updateVisibleSlides();
    window.addEventListener("resize", updateVisibleSlides);
    return () => window.removeEventListener("resize", updateVisibleSlides);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleSlides);

  React.useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  React.useEffect(() => {
    if (hovered || maxIndex === 0) return undefined;

    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [hovered, maxIndex]);

  const dotCount = maxIndex + 1;

  return (
    <section className="overflow-hidden bg-surface py-20 dark:bg-dark-surface md:py-28 lg:py-32">
      <div className="section-container" ref={ref}>
        <Reveal>
          <h2 className="section-title text-center">What Students Say</h2>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-5 max-w-2xl text-center">
          <p className="section-subtitle max-w-none">Real stories from real students who found their path.</p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-14"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="overflow-hidden">
            <motion.div
              className="-mx-3 flex"
              animate={{ x: `-${currentIndex * (100 / visibleSlides)}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {testimonials.map((testimonial) => (
                <div key={`${testimonial.name}-${testimonial.details}`} className="shrink-0 px-3" style={{ width: `${100 / visibleSlides}%` }}>
                  <Card className="h-full p-6 md:p-8">
                    <span className="font-serif text-6xl leading-none text-brand-forest/10 dark:text-brand-mint/10">“</span>
                    <p className="mt-3 text-body-lg italic text-slate dark:text-dark-muted">{testimonial.quote}</p>
                    <div className="mt-6 flex items-center gap-1 text-brand-sand">
                      {Array.from({ length: testimonial.rating }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-6 font-semibold text-charcoal dark:text-dark-text">{testimonial.name}</p>
                    <p className="mt-1 text-body-sm text-muted dark:text-dark-muted">{testimonial.details}</p>
                  </Card>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                disabled={currentIndex === 0}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-charcoal transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-border dark:text-dark-text"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((index) => Math.min(maxIndex, index + 1))}
                disabled={currentIndex === maxIndex}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-charcoal transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-border dark:text-dark-text"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <AnimatePresence mode="popLayout">
                {Array.from({ length: dotCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${index === currentIndex ? "w-8 bg-brand-forest dark:bg-brand-mint" : "w-2.5 bg-border dark:bg-dark-border"}`}
                    aria-label={`Go to testimonial group ${index + 1}`}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}