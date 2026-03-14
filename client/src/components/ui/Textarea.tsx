import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaVariant = "default" | "filled";
type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: TextareaVariant;
  inputSize?: TextareaSize;
}

const sizeClasses: Record<TextareaSize, string> = {
  sm: "px-3 py-2.5 text-body-sm",
  md: "px-4 py-3 text-body-sm sm:text-body",
  lg: "px-4 py-3.5 text-body",
};

const variantClasses: Record<TextareaVariant, string> = {
  default: "bg-surface dark:bg-dark-surface",
  filled: "bg-brand-cream dark:bg-dark-elevated",
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, error, helperText, variant = "default", inputSize = "md", id, rows = 4, ...props },
  ref,
) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={textareaId} className="block text-body-sm font-medium text-charcoal dark:text-dark-text">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          "w-full rounded-lg border text-charcoal placeholder:text-muted transition-all duration-200 ease-smooth outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:text-dark-text dark:placeholder:text-dark-muted",
          variantClasses[variant],
          sizeClasses[inputSize],
          error
            ? "border-status-error ring-1 ring-status-error/30"
            : "border-border focus:border-brand-forest focus:ring-1 focus:ring-brand-forest/30",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-body-sm text-status-error">{error}</p> : null}
      {!error && helperText ? <p className="text-body-sm text-muted dark:text-dark-muted">{helperText}</p> : null}
    </div>
  );
});