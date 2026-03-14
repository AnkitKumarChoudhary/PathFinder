import Image from "next/image";
import * as React from "react";

import { cn, getInitials } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline";

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

const statusClasses: Record<AvatarStatus, string> = {
  online: "bg-status-success",
  offline: "bg-muted",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  ring?: boolean;
}

export function Avatar({
  className,
  src,
  alt,
  firstName = "Path",
  lastName = "Finder",
  size = "md",
  status,
  ring = false,
  ...props
}: AvatarProps) {
  const initials = getInitials(firstName, lastName);

  return (
    <div className="relative inline-flex" {...props}>
      <div
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-forest font-semibold text-white",
          sizeClasses[size],
          ring && "ring-2 ring-brand-cream dark:ring-dark-elevated",
          className,
        )}
      >
        {src ? <Image src={src} alt={alt ?? `${firstName} ${lastName}`} fill className="object-cover" /> : initials}
      </div>
      {status ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-cream dark:border-dark-surface",
            statusClasses[status],
          )}
        />
      ) : null}
    </div>
  );
}