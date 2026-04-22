import { HeroSkeleton, NewsCardSkeleton } from "@/components/ui/Skeleton";

export default function ArticleLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <HeroSkeleton />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
              style={{ width: `${80 + Math.random() * 20}%` }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
