"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  name?: string;
}

export function RadioGroup({
  className,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = "vertical",
  name,
  ...props
}: RadioGroupProps) {
  const generatedName = React.useId();
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? options[0]?.value);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {label ? <p className="text-body-sm font-medium text-charcoal dark:text-dark-text">{label}</p> : null}
      <div className={cn("gap-3", orientation === "horizontal" ? "flex flex-wrap" : "grid")}> 
        {options.map((option) => {
          const checked = option.value === currentValue;
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition-all duration-200 hover:border-brand-forest/40 dark:border-dark-border dark:bg-dark-surface"
            >
              <input
                type="radio"
                name={name ?? generatedName}
                value={option.value}
                checked={checked}
                onChange={() => handleChange(option.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-200",
                  checked ? "border-brand-forest" : "border-border dark:border-dark-border",
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full", checked ? "bg-brand-forest" : "bg-transparent")} />
              </span>
              <span>
                <span className="block text-body-sm font-medium text-charcoal dark:text-dark-text">{option.label}</span>
                {option.description ? (
                  <span className="mt-1 block text-caption text-muted dark:text-dark-muted">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}