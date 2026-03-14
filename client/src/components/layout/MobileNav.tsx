"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { mobileNavigation, getRoleFromPathname, type DashboardRole } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  role?: DashboardRole;
}

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();
  const activeRole = role ?? getRoleFromPathname(pathname);
  const items = mobileNavigation[activeRole];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md dark:border-dark-border dark:bg-dark-surface/95 md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-3 text-caption font-medium transition-colors duration-200",
                active ? "text-brand-forest dark:text-brand-mint" : "text-muted dark:text-dark-muted",
              )}
            >
              <span className={cn("rounded-full p-2", active && "bg-brand-forest/10 dark:bg-brand-forest/20")}>
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}