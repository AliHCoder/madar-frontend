import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 pb-16 mt-8 space-y-14">
        {/* Header skeleton */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div>
              <Skeleton className="h-7 w-40 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
        </section>

        {/* Section skeletons */}
        {[1, 2, 3].map((section) => (
          <section key={section}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <div>
                  <Skeleton className="h-7 w-32 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-36 rounded-full" />
            </div>
            <Skeleton className="h-px w-full mb-8" />
            {/* NewsGrid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((card) => (
                <div key={card} className="space-y-3">
                  <Skeleton className="aspect-[16/9] rounded-xl" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
