"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpenIds?: string[];
}

export function Accordion({ className, items, multiple = false, defaultOpenIds = [], ...props }: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<string[]>(defaultOpenIds);

  const toggleItem = (id: string) => {
    setOpenIds((currentIds) => {
      const isOpen = currentIds.includes(id);
      if (multiple) {
        return isOpen ? currentIds.filter((itemId) => itemId !== id) : [...currentIds, id];
      }
      return isOpen ? [] : [id];
    });
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-dark-border dark:bg-dark-surface">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => toggleItem(item.id)}
            >
              <span className="font-medium text-charcoal dark:text-dark-text">{item.title}</span>
              <ChevronDown className={cn("h-5 w-5 text-muted transition-transform duration-200", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border px-5 py-4 text-body text-muted dark:border-dark-border dark:text-dark-muted">
                    {item.content}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}