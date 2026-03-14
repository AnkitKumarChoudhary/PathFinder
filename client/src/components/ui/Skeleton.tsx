import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "circle" | "rect" | "card";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  circle: "h-12 w-12 rounded-full",
  rect: "h-24 w-full rounded-xl",
  card: "h-40 w-full rounded-2xl",
};

export function Skeleton({ className, variant = "rect", ...props }: SkeletonProps) {
  return <div className={cn("skeleton animate-pulse", variantClasses[variant], className)} {...props} />;
}