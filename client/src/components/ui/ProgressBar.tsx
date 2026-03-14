"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type ProgressBarSize = "sm" | "md" | "lg";

const sizeClasses: Record<ProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const colorClasses: Record<string, string> = {
  forest: "bg-brand-forest",
  terracotta: "bg-brand-terracotta",
  sand: "bg-brand-sand",
  mint: "bg-brand-mint",
};

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  showLabel?: boolean;
  size?: ProgressBarSize;
  color?: keyof typeof colorClasses;
}

export function ProgressBar({
  className,
  value,
  showLabel = false,
  size = "md",
  color = "forest",
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {showLabel ? (
        <div className="flex items-center justify-between text-body-sm text-muted dark:text-dark-muted">
          <span>Progress</span>
          <span className="font-mono text-charcoal dark:text-dark-text">{clampedValue}%</span>
        </div>
      ) : null}
      <div className={cn("overflow-hidden rounded-full bg-border/70 dark:bg-dark-border", sizeClasses[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClasses[color])}
        />
      </div>
    </div>
  );
}