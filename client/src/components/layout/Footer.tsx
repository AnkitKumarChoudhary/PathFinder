import Link from "next/link";
import { Github, GraduationCap, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="h-1 w-full bg-gradient-to-r from-brand-forest via-brand-sand to-brand-terracotta" />
      <div className="section-container py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-5">
            <Link href="/" className="inline-flex font-heading text-heading-3 font-bold text-white">
              PathFinder
            </Link>
            <p className="max-w-sm text-body text-white/75">
              AI-powered career guidance for every student in India. Aligned with NEP 2020.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Linkedin, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:border-brand-sand hover:text-brand-sand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-body-sm text-white/90">
              <GraduationCap className="h-4 w-4 text-brand-sand" />
              NEP 2020 Aligned
            </span>
          </div>

          <div>
            <h3 className="text-heading-4 text-white">Platform</h3>
            <div className="mt-5 space-y-3 text-body text-white/75">
              <Link href="/careers" className="block transition hover:text-brand-sand">Career Explorer</Link>
              <Link href="/student/assessment" className="block transition hover:text-brand-sand">Assessments</Link>
              <Link href="/student/mentorship" className="block transition hover:text-brand-sand">Find a Mentor</Link>
              <Link href="/student/resources" className="block transition hover:text-brand-sand">Resources</Link>
              <Link href="/student/resume-builder" className="block transition hover:text-brand-sand">Resume Builder</Link>
            </div>
          </div>

          <div>
            <h3 className="text-heading-4 text-white">Company</h3>
            <div className="mt-5 space-y-3 text-body text-white/75">
              <Link href="/about" className="block transition hover:text-brand-sand">About Us</Link>
              <Link href="/contact" className="block transition hover:text-brand-sand">Contact</Link>
              <Link href="/" className="block transition hover:text-brand-sand">Blog</Link>
              <Link href="/" className="block transition hover:text-brand-sand">Privacy Policy</Link>
              <Link href="/" className="block transition hover:text-brand-sand">Terms of Service</Link>
            </div>
          </div>

          <div>
            <h3 className="text-heading-4 text-white">Get in Touch</h3>
            <div className="mt-5 space-y-3 text-body text-white/75">
              <p>hello@pathfinder.in</p>
              <p>+91 11-XXXX-XXXX</p>
              <p>Connaught Place, New Delhi - 110001</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-body-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <p>© 2025 PathFinder. All rights reserved.</p>
          <p>Built with love for SIH 2024 | Team PathMakers</p>
        </div>
      </div>
    </footer>
  );
}