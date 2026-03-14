import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type SelectVariant = "default" | "filled";
type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: SelectVariant;
  inputSize?: SelectSize;
  placeholder?: string;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: "h-10 px-3 text-body-sm",
  md: "h-11 px-4 text-body-sm sm:text-body",
  lg: "h-12 px-4 text-body",
};

const variantClasses: Record<SelectVariant, string> = {
  default: "bg-surface dark:bg-dark-surface",
  filled: "bg-brand-cream dark:bg-dark-elevated",
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    label,
    error,
    helperText,
    variant = "default",
    inputSize = "md",
    id,
    children,
    placeholder,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="block text-body-sm font-medium text-charcoal dark:text-dark-text">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full appearance-none rounded-lg border text-charcoal transition-all duration-200 ease-smooth outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:text-dark-text",
            variantClasses[variant],
            sizeClasses[inputSize],
            error
              ? "border-status-error ring-1 ring-status-error/30"
              : "border-border focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30",
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted dark:text-dark-muted" />
      </div>
      {error ? <p className="text-body-sm text-status-error">{error}</p> : null}
      {!error && helperText ? <p className="text-body-sm text-muted dark:text-dark-muted">{helperText}</p> : null}
    </div>
  );
});