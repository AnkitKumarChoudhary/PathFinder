"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

export function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  disabled,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const nextValue = !isChecked;
    if (!isControlled) setInternalChecked(nextValue);
    onCheckedChange?.(nextValue);
  };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-dark-bg",
          isChecked ? "bg-brand-forest" : "bg-border dark:bg-dark-border",
        )}
        {...props}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="block h-5 w-5 rounded-full bg-white shadow-soft"
          animate={{ x: isChecked ? 24 : 4 }}
        />
      </button>
      {label ? <span className="text-body-sm text-charcoal dark:text-dark-text">{label}</span> : null}
    </div>
  );
}