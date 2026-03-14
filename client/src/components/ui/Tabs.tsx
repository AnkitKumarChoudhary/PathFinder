"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  defaultValue?: string;
}

export function Tabs({ className, items, defaultValue, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue ?? items[0]?.id);
  const currentItem = items.find((item) => item.id === activeTab) ?? items[0];

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="flex flex-wrap gap-3 border-b border-border dark:border-dark-border">
        {items.map((item) => {
          const isActive = item.id === currentItem.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative -mb-px px-1 py-3 text-body-sm font-medium transition-colors duration-200",
                isActive
                  ? "text-brand-forest dark:text-brand-mint"
                  : "text-muted hover:text-charcoal dark:text-dark-muted dark:hover:text-dark-text",
              )}
            >
              {item.label}
              {isActive ? (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-forest dark:bg-brand-mint"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {currentItem.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}