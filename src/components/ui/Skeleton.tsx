// Skeleton.tsx
import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  const roundedMap = {
    sm: "rounded",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  };

  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-100",
        roundedMap[rounded],
        className,
      )}
    />
  );
}

export function NewsCardSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Skeleton className="h-52 w-full" rounded="sm" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" rounded="full" />
          <Skeleton className="h-3 w-16" rounded="full" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] rounded-3xl overflow-hidden bg-gray-100">
      <Skeleton className="absolute inset-0 h-full w-full" rounded="sm" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-4">
        <Skeleton className="h-5 w-24" rounded="full" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}
