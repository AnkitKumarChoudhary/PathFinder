"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export type ThemeToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-charcoal shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-forest/40 hover:text-brand-forest dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:border-brand-mint/50 dark:hover:text-brand-mint",
        className,
      )}
      aria-label="Toggle theme"
      {...props}
    >
      <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden">
        <Sun
          className={cn(
            "absolute h-5 w-5 transition-all duration-300",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
          )}
        />
        <Moon
          className={cn(
            "absolute h-5 w-5 transition-all duration-300",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
          )}
        />
      </span>
    </button>
  );
}