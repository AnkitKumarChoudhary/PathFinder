import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type BadgeVariant = "forest" | "terracotta" | "sand" | "mint" | "gray" | "success" | "warning" | "error";
type BadgeSize = "sm" | "md";

const variantClasses: Record<BadgeVariant, string> = {
  forest: "bg-brand-forest/10 text-brand-forest dark:bg-brand-forest/20 dark:text-brand-mint",
  terracotta: "bg-brand-terracotta/10 text-brand-terracotta dark:bg-brand-terracotta/20 dark:text-brand-terracotta",
  sand: "bg-brand-sand/15 text-charcoal dark:bg-brand-sand/20 dark:text-brand-sand",
  mint: "bg-brand-mint/20 text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint",
  gray: "bg-border/80 text-slate dark:bg-dark-border dark:text-dark-muted",
  success: "bg-status-success/10 text-status-success dark:bg-status-success/20 dark:text-brand-mint",
  warning: "bg-status-warning/20 text-charcoal dark:bg-status-warning/20 dark:text-status-warning",
  error: "bg-status-error/10 text-status-error dark:bg-status-error/20 dark:text-status-error",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2.5 py-1 text-caption",
  md: "px-3 py-1.5 text-body-sm",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Badge({
  className,
  variant = "forest",
  size = "md",
  dot = false,
  dismissible = false,
  onDismiss,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg font-medium transition-colors duration-200",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {dot ? <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" /> : null}
      <span>{children}</span>
      {dismissible ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-0.5 transition hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Dismiss badge"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  );
}