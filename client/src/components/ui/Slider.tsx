"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  stepLabels?: string[];
  showValue?: boolean;
}

export function Slider({
  className,
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  stepLabels,
  showValue = true,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(Number(defaultValue ?? min));
  const isControlled = value !== undefined;
  const currentValue = Number(isControlled ? value : internalValue);
  const percentage = ((currentValue - Number(min)) / (Number(max) - Number(min))) * 100;

  return (
    <div className={cn("space-y-3", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-4">
          {label ? <label className="text-body-sm font-medium text-charcoal dark:text-dark-text">{label}</label> : <span />}
          {showValue ? <span className="font-mono text-body-sm text-brand-forest dark:text-brand-mint">{currentValue}</span> : null}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(event) => {
          if (!isControlled) {
            setInternalValue(Number(event.target.value));
          }
          onChange?.(event);
        }}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-border dark:[&::-webkit-slider-runnable-track]:bg-dark-border [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-forest [&::-webkit-slider-thumb]:shadow-card"
        style={{
          background: `linear-gradient(to right, #1B4332 0%, #1B4332 ${percentage}%, #DEE2E6 ${percentage}%, #DEE2E6 100%)`,
        }}
        {...props}
      />
      {stepLabels?.length ? (
        <div className="flex justify-between text-caption text-muted dark:text-dark-muted">
          {stepLabels.map((stepLabel) => (
            <span key={stepLabel}>{stepLabel}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}