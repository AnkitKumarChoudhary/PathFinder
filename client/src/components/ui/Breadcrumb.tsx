import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: "slash" | "chevron";
}

export function Breadcrumb({ className, items, separator = "chevron", ...props }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-body-sm text-muted dark:text-dark-muted", className)} {...props}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="transition hover:text-charcoal dark:hover:text-dark-text">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "font-semibold text-charcoal dark:text-dark-text")}>{item.label}</span>
            )}
            {!isLast ? (
              separator === "chevron" ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <span aria-hidden="true">/</span>
              )
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}