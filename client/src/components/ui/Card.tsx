import * as React from "react";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "accent" | "glass" | "flat" | "interactive";
type CardPadding = "sm" | "md" | "lg";

const paddingClasses: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const accentColorClasses: Record<string, string> = {
  forest: "border-l-brand-forest",
  terracotta: "border-l-brand-terracotta",
  sand: "border-l-brand-sand",
  mint: "border-l-brand-mint",
};

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  accentColor?: keyof typeof accentColorClasses;
  as?: React.ElementType;
}

export function Card({
  className,
  variant = "default",
  padding = "md",
  accentColor = "forest",
  as: Component = "div",
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        variant === "default" && "card-base",
        variant === "accent" && "card-accent-left",
        variant === "glass" && "card-glass",
        variant === "flat" && "rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface",
        variant === "interactive" && "card-base hover:-translate-y-1",
        paddingClasses[padding],
        variant === "accent" && accentColorClasses[accentColor],
        className,
      )}
      {...props}
    />
  );
}