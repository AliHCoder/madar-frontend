"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { newsApi, archiveApi } from "@/lib/api";
import { Article, ArchivedStream } from "@/types/news";
import NewsGrid from "@/components/news/NewsGrid";
import { Search, X, Archive } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const [newsResults, setNewsResults] = useState<{
    data: Article[];
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);
  const [archiveResults, setArchiveResults] = useState<{
    data: ArchivedStream[];
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setNewsResults(null);
      setArchiveResults(null);
      return;
    }
    setLoading(true);
    Promise.all([
      newsApi.search(query.trim(), 1, 10),
      archiveApi.search(query.trim(), 1, 10),
    ])
      .then(([news, archive]) => {
        setNewsResults(news);
        setArchiveResults(archive);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      }
    },
    [inputValue, router],
  );

  const totalResults =
    (newsResults?.total || 0) + (archiveResults?.total || 0);
  const hasResults = totalResults > 0;

  return (
    <div className="space-y-8">
      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        className="relative max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="عبارت مورد نظر را جستجو کنید..."
            className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors text-base"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Results header */}
      {query && (
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
            نتایج جستجو
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {loading
              ? `جستجو برای "${query}"`
              : `${totalResults} نتیجه برای "${query}"`}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state - no query */}
      {!query && !loading && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Search size={48} className="mx-auto mb-3 opacity-50" />
          <p>عبارت مورد نظر خود را جستجو کنید</p>
        </div>
      )}

      {/* Empty state - no results */}
      {query && !loading && !hasResults && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <X size={48} className="mx-auto mb-3 opacity-50" />
          <p>نتیجه‌ای برای "{query}" یافت نشد</p>
        </div>
      )}

      {/* News results */}
      {newsResults && newsResults.data.length > 0 && !loading && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              اخبار
              <span className="text-gray-500 dark:text-gray-400 mr-2 text-sm font-normal">
                ({newsResults.total})
              </span>
            </h2>
          </div>
          <NewsGrid articles={newsResults.data} />
        </section>
      )}

      {/* Archive results */}
      {archiveResults && archiveResults.data.length > 0 && !loading && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              آرشیو ویدیوها
              <span className="text-gray-500 dark:text-gray-400 mr-2 text-sm font-normal">
                ({archiveResults.total})
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {archiveResults.data.map((item) => (
              <Link
                key={item.id}
                href={`/archive/${item.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                      <Archive size={32} className="text-white/80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    <Archive size={12} />
                    <span>آرشیو</span>
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
