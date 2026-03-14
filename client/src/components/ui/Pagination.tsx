import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./Button";

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  className,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  ...props
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2),
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border/70 bg-surface p-4 dark:border-dark-border dark:bg-dark-surface md:flex-row md:items-center md:justify-between",
        className,
      )}
      {...props}
    >
      <p className="text-body-sm text-muted dark:text-dark-muted">
        Showing {start} to {end} of {totalItems} results
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange?.(page)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg border text-body-sm font-medium transition-all duration-200",
                page === currentPage
                  ? "border-brand-forest bg-brand-forest text-white"
                  : "border-border bg-transparent text-charcoal hover:border-brand-forest/40 hover:text-brand-forest dark:border-dark-border dark:text-dark-text",
              )}
            >
              {page}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}