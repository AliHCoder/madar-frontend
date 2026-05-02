// app/page.tsx
import HeroSection from "@/components/news/HeroSection";
import NewsGrid from "@/components/news/NewsGrid";
import { newsApi, liveApi, archiveApi } from "@/lib/api";
import { TrendingUp, Clock, Radio, Archive } from "lucide-react";
import LiveCard from "@/components/live/LiveCard";
import ArchiveCard from "@/components/archive/ArchiveCard";

export default async function HomePage() {
  const [latest, breaking, liveStreams, archivedVideos] = await Promise.all([
    newsApi.getLatest(),
    newsApi.getBreaking(),
    liveApi.getActive().catch(() => []),
    archiveApi.getRecent(3).catch(() => []),
  ]);

  const allArticles = latest.data || [];
  const [hero, ...rest] = allArticles;

  // مطمئن شو آرایه هستن
  const safeLiveStreams = Array.isArray(liveStreams) ? liveStreams : [];
  const safeArchivedVideos = Array.isArray(archivedVideos)
    ? archivedVideos
    : [];

  const liveCount = safeLiveStreams.filter(
    (s) => s?.isLive || s?.status === "live",
  ).length;

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 pb-16 mt-8 space-y-14">
        {/* Hero */}
        {hero && (
          <section className="relative">
            <HeroSection
              topBanners={allArticles.slice(0, 2)}
              sideCards={allArticles.slice(2, 4)}
              sliderArticles={allArticles.slice(4, 8)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeLiveStreams
                .slice(0, 3)
                .map((stream) =>
                  stream ? <LiveCard key={stream.id} stream={stream} /> : null,
                )}
            </div>
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
            </div>

            <div
              className="w-full h-px mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626 0%, rgba(220,38,38,0.3) 50%, transparent 100%)",
              }}
            />

            <NewsGrid articles={rest} />
          </section>
        )}

        {/* آرشیو */}
        {safeArchivedVideos.length > 0 && (
          <section className="relative">
            <div className="flex items-center gap-3 mb-8">
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

            <div
              className="w-full h-px mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626 0%, rgba(220,38,38,0.3) 50%, transparent 100%)",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeArchivedVideos
                .slice(0, 3)
                .map((stream) =>
                  stream ? (
                    <ArchiveCard key={stream.id} stream={stream} />
                  ) : null,
                )}
            </div>
          </section>
        )}

        {/* پربازدیدترین */}
        {rest.length > 0 && (
          <section className="relative">
            <div className="flex items-center gap-3 mb-8">
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

            <div
              className="w-full h-px mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #dc2626 0%, rgba(220,38,38,0.3) 50%, transparent 100%)",
              }}
            />

            <NewsGrid articles={rest.slice(0, 3)} />
          </section>
        )}
      </main>
    </div>
  );
}
