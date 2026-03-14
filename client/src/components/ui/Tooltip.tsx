"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

type TooltipPosition = "top" | "bottom" | "left" | "right";

const positionClasses: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 mb-3 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-3 -translate-x-1/2",
  left: "right-full top-1/2 mr-3 -translate-y-1/2",
  right: "left-full top-1/2 ml-3 -translate-y-1/2",
};

const arrowClasses: Record<TooltipPosition, string> = {
  top: "left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-charcoal",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-charcoal",
  left: "left-full top-1/2 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-charcoal",
  right: "right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-charcoal",
};

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open ? (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={cn(
              "pointer-events-none absolute z-50 rounded-lg bg-charcoal px-3 py-2 text-caption text-white shadow-soft",
              positionClasses[position],
            )}
          >
            {content}
            <span className={cn("absolute h-0 w-0", arrowClasses[position])} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}