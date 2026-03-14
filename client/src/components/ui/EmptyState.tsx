import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ className, icon: Icon, title, description, action, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-brand-ivory px-6 py-12 text-center shadow-soft dark:border-dark-border dark:bg-dark-surface",
        className,
      )}
      {...props}
    >
      <div className="mb-5 rounded-2xl bg-brand-sand/15 p-4 text-brand-forest dark:bg-brand-forest/20 dark:text-brand-mint">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-heading-4">{title}</h3>
      <p className="mt-3 max-w-md text-body text-muted dark:text-dark-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}