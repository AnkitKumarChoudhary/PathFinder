import * as React from "react";

import { cn } from "@/lib/utils";

type InputVariant = "default" | "filled";
type InputSize = "sm" | "md" | "lg";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: InputVariant;
  inputSize?: InputSize;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "h-10 px-3 text-body-sm",
  md: "h-11 px-4 text-body-sm sm:text-body",
  lg: "h-12 px-4 text-body",
};

const variantClasses: Record<InputVariant, string> = {
  default: "bg-surface dark:bg-dark-surface",
  filled: "bg-brand-cream dark:bg-dark-elevated",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = "default",
    inputSize = "md",
    id,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="block text-body-sm font-medium text-charcoal dark:text-dark-text">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-dark-muted">
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border text-charcoal placeholder:text-muted transition-all duration-200 ease-smooth outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:text-dark-text dark:placeholder:text-dark-muted",
            variantClasses[variant],
            sizeClasses[inputSize],
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error
              ? "border-status-error ring-1 ring-status-error/30"
              : "border-border focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30",
            className,
          )}
          {...props}
        />
        {rightIcon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted dark:text-dark-muted">
            {rightIcon}
          </span>
        ) : null}
      </div>
      {error ? <p className="text-body-sm text-status-error">{error}</p> : null}
      {!error && helperText ? <p className="text-body-sm text-muted dark:text-dark-muted">{helperText}</p> : null}
    </div>
  );
});