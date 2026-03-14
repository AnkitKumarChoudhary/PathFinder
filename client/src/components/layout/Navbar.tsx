"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { marketingNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

function PathFinderLogo() {
  return (
    <span className="relative inline-flex items-center font-heading text-heading-3 font-bold text-charcoal dark:text-dark-text">
      PathFinder
      <span className="absolute right-[2.68rem] top-1 h-1.5 w-1.5 rounded-full bg-brand-terracotta" />
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/50 bg-brand-cream/95 shadow-soft backdrop-blur-md dark:border-dark-border dark:bg-dark-bg/95"
            : "bg-transparent",
        )}
      >
        <div className="section-container flex h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <PathFinderLogo />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {marketingNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative py-2 text-body-sm transition-colors duration-200",
                    active
                      ? "font-medium text-brand-forest dark:text-brand-mint"
                      : "text-slate hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-brand-terracotta transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-body font-medium text-charcoal transition-all duration-200 ease-smooth hover:scale-[1.02] hover:bg-brand-cream active:scale-[0.98] dark:text-dark-text dark:hover:bg-dark-elevated"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-brand-terracotta px-6 py-2.5 text-body font-medium text-white shadow-glow-terracotta transition-all duration-200 ease-smooth hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-charcoal shadow-soft dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed right-0 top-0 z-[61] flex h-full w-[85vw] max-w-sm flex-col bg-surface p-6 shadow-elevated dark:bg-dark-surface md:hidden"
            >
              <div className="flex items-center justify-between">
                <PathFinderLogo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border dark:border-dark-border"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-10 space-y-2">
                {marketingNavItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-body font-medium transition-colors duration-200",
                        active
                          ? "bg-brand-forest text-white"
                          : "text-charcoal hover:bg-brand-cream dark:text-dark-text dark:hover:bg-dark-elevated",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto space-y-3">
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-body font-medium text-charcoal transition hover:bg-brand-cream dark:text-dark-text dark:hover:bg-dark-elevated"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-brand-terracotta px-4 py-3 text-body font-medium text-white transition hover:brightness-110"
                >
                  Get Started
                </Link>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}