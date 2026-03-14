import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, checked, defaultChecked, onChange, disabled, id, ...props },
  ref,
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 text-body-sm text-charcoal dark:text-dark-text",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span className="relative inline-flex">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-md border border-border bg-surface transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-forest peer-focus-visible:ring-offset-2 peer-checked:border-brand-forest peer-checked:bg-brand-forest dark:border-dark-border dark:bg-dark-surface",
            className,
          )}
        >
          <Check className="h-3.5 w-3.5 text-transparent transition-colors duration-200 peer-checked:text-white" />
        </span>
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
});