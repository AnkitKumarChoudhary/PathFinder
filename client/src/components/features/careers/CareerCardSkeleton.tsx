import { Skeleton } from '@/components/ui/Skeleton'

export function CareerCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-dark-border dark:bg-dark-surface">
      <Skeleton className="h-[3px] w-full rounded-none" />
      <div className="p-5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-3 h-6 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-dark-border">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}
