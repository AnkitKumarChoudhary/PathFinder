import * as React from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-terracotta text-white shadow-soft hover:brightness-110 dark:bg-brand-terracotta dark:text-white",
  secondary:
    "bg-brand-forest text-white shadow-soft hover:bg-brand-sage dark:bg-brand-forest dark:text-white",
  outline:
    "border-2 border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-white dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-text dark:hover:text-dark-bg",
  ghost:
    "bg-transparent text-charcoal hover:bg-brand-cream dark:text-dark-text dark:hover:bg-dark-elevated",
  link: "bg-transparent px-0 text-brand-forest hover:underline hover:underline-offset-4 dark:text-brand-mint",
  danger: "bg-status-error text-white shadow-soft hover:brightness-110 dark:bg-status-error",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "rounded-lg px-4 py-2 text-body-sm",
  md: "rounded-lg px-6 py-2.5 text-body",
  lg: "rounded-xl px-8 py-3 text-body-lg",
  xl: "rounded-xl px-10 py-4 text-body-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-smooth focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-dark-bg",
        variant !== "link" && sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading ? rightIcon : null}
    </button>
  );
});