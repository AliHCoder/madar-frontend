// app/page.tsx
"use client";

import HeroSection from "@/components/news/HeroSection";
import Link from "next/link";
import { newsApi, liveApi, archiveApi, heroApi } from "@/lib/api";
import { TrendingUp, Clock, Radio, Archive, ArrowLeft } from "lucide-react";
import HorizontalScrollRow from "@/components/ui/HorizontalScrollRow";
import NewsCard from "@/components/news/NewsCard";
import LiveCard from "@/components/live/LiveCard";
import ArchiveCard from "@/components/archive/ArchiveCard";
import { useState, useEffect } from "react";
import type { Article, LiveStream, ArchivedStream, HeroItem } from "@/types/news";

export default function HomePage() {
  const [data, setData] = useState<{
    latest: any;
    breaking: any;
    liveStreams: LiveStream[];
    archivedVideos: ArchivedStream[];
  }>({
    latest: null,
    breaking: null,
    liveStreams: [],
    archivedVideos: [],
  });
  const [heroSettings, setHeroSettings] = useState<{
    isActive: boolean;
    items: { type: "article" | "archive" | "live"; data: any }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- اولین fetch: مقالات اخیر + پخش زنده ----------
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        setError(null);

        const [latest, breaking, liveStreams, hero] = await Promise.allSettled([
          newsApi.getLatest(1, 10),
          newsApi.getBreaking(),
          liveApi.getActive(),
          heroApi.getSettings(),
        ]);

        if (hero.status === "fulfilled") setHeroSettings(hero.value);

        setData((prev) => ({
          ...prev,
          latest:
            latest.status === "fulfilled"
              ? latest.value
              : { data: [], total: 0 },
          breaking: breaking.status === "fulfilled" ? breaking.value : [],
          liveStreams:
            liveStreams.status === "fulfilled" ? liveStreams.value : [],
        }));
      } catch (err: any) {
        setError(err?.message || "خطا در بارگذاری داده‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  // ---------- بارگذاری آرشیو (بعد از اولین رندر) ----------
  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const archived = await archiveApi.getRecent(3);
        setData((prev) => ({
          ...prev,
          archivedVideos: archived,
        }));
      } catch (e) {
        // ignore
      }
    };
    // اجرای بعد از اولین paint
    requestAnimationFrame(() => fetchArchive());
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-red-200 dark:border-red-900 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            خطا در بارگذاری
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            بارگذاری مجدد
          </button>
        </div>
      </div>
    );
  }

  const allArticles = data.latest?.data || [];
  const safeLiveStreams = Array.isArray(data.liveStreams)
    ? data.liveStreams
    : [];
  const safeArchivedVideos = Array.isArray(data.archivedVideos)
    ? data.archivedVideos
    : [];

  const toHeroItem = (
    item: { type: "article" | "archive" | "live"; data: any },
  ): HeroItem => {
    let link = `/article/${item.data.id}`;
    if (item.type === "archive") link = `/archive/${item.data.id}`;
    else if (item.type === "live") link = `/live/${item.data.id}`;
    return {
      id: item.data.id,
      title: item.data.title,
      image: item.data.image || item.data.thumbnail || "",
      author: item.data.author || "",
      link,
      type: item.type,
    };
  };

  const heroItems: HeroItem[] =
    heroSettings?.isActive && heroSettings.items.length > 0
      ? heroSettings.items.map(toHeroItem)
      : allArticles.slice(0, 8).map((a: Article) => ({
          id: a.id,
          title: a.title,
          image: a.image,
          author: a.author,
          link: `/article/${a.id}`,
          type: "article" as const,
        }));

  if (allArticles.length === 0 && heroItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">
          داده‌ای برای نمایش وجود ندارد
        </p>
      </div>
    );
  }

  const [hero, ...rest] = allArticles;
  const liveCount = safeLiveStreams.filter(
    (s) => s?.isLive || s?.status === "live",
  ).length;

  const liveList = safeLiveStreams.slice(0, 3);
  const MAX_ITEMS = 10;
  const combinedItems = [
    ...liveList.map((s: LiveStream) => ({ type: "live" as const, data: s, id: s.id })),
    ...rest.slice(0, MAX_ITEMS - liveList.length).map((a: Article) => ({ type: "article" as const, data: a, id: a.id })),
  ];

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 pb-16 mt-8 space-y-14">
        {/* Hero */}
        {heroItems.length > 0 && (
          <section className="relative">
            <HeroSection
              topBanners={heroItems.slice(0, 2)}
              sideCards={heroItems.slice(2, 4)}
              sliderArticles={heroItems.slice(4, 8)}
            />
          </section>
        )}

        {/* پخش زنده */}
        {safeLiveStreams.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow:
                      "0 0 20px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Radio size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-white">
                    پخش زنده
                  </h2>
                  <p className="text-[11px] text-red-500 font-semibold tracking-widest mt-0.5">
                    LIVE STREAMS
                  </p>
                </div>
              </div>
              {liveCount > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(220,38,38,0.08)",
                    border: "1px solid rgba(220,38,38,0.25)",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                    style={{ boxShadow: "0 0 6px rgba(220,38,38,0.7)" }}
                  />
                  <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                    {liveCount} زنده
                  </span>
                </div>
              )}
            </div>

            <div
              className="w-full h-px mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626 0%, rgba(220,38,38,0.3) 50%, transparent 100%)",
              }}
            />

            <HorizontalScrollRow>
              {combinedItems.map((item) => (
                <div key={item.id} className="min-w-[300px] w-[300px] flex-shrink-0">
                  {item.type === "live" ? (
                    <LiveCard stream={item.data} />
                  ) : (
                    <NewsCard article={item.data} delay={0} />
                  )}
                </div>
              ))}
            </HorizontalScrollRow>
          </section>
        )}

        {/* آخرین اخبار */}
        {rest.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow:
                      "0 0 20px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Clock size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-white">
                    آخرین اخبار
                  </h2>
                  <p className="text-[11px] text-red-500 font-semibold tracking-widest mt-0.5">
                    LATEST NEWS
                  </p>
                </div>
              </div>
              <Link
                href="/search"
                className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
              >
                مشاهده همه
                <ArrowLeft size={16} />
              </Link>
            </div>

            <div
              className="w-full h-px mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626 0%, rgba(220,38,38,0.3) 50%, transparent 100%)",
              }}
            />

            <HorizontalScrollRow>
              {rest.slice(0, MAX_ITEMS).map((article: Article) => (
                <div key={article.id} className="min-w-[300px] w-[300px] flex-shrink-0">
                  <NewsCard article={article} delay={0} />
                </div>
              ))}
            </HorizontalScrollRow>
          </section>
        )}

        {/* آرشیو */}
        {safeArchivedVideos.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow:
                      "0 0 20px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Archive size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-white">
                    آرشیو
                  </h2>
                  <p className="text-[11px] text-red-500 font-semibold tracking-widest mt-0.5">
                    ARCHIVE
                  </p>
                </div>
              </div>
              <Link
                href="/archive"
                className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors font-medium"
              >
                مشاهده همه
                <ArrowLeft size={16} />
              </Link>
            </div>

            <div
              className="w-full h-px mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626 0%, rgba(220,38,38,0.3) 50%, transparent 100%)",
              }}
            />

            <HorizontalScrollRow>
              {safeArchivedVideos.slice(0, 3).map((stream) =>
                stream ? (
                  <div key={stream.id} className="min-w-[300px] w-[300px] flex-shrink-0">
                    <ArchiveCard stream={stream} />
                  </div>
                ) : null,
              )}
            </HorizontalScrollRow>
          </section>
        )}

        {/* پربازدیدترین */}
        {allArticles.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow:
                      "0 0 20px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-white">
                    پربازدیدترین
                  </h2>
                  <p className="text-[11px] text-red-500 font-semibold tracking-widest mt-0.5">
                    TRENDING
                  </p>
                </div>
              </div>
            </div>

            <div
              className="w-full h-px mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626 0%, rgba(220,38,38,0.3) 50%, transparent 100%)",
              }}
            />

            <HorizontalScrollRow>
              {allArticles.slice(hero ? 1 : 0, MAX_ITEMS + (hero ? 1 : 0)).map((article: Article) => (
                <div key={article.id} className="min-w-[300px] w-[300px] flex-shrink-0">
                  <NewsCard article={article} delay={0} />
                </div>
              ))}
            </HorizontalScrollRow>
          </section>
        )}
      </main>
    </div>
  );
}
