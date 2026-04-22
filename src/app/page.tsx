import HeroSection from "@/components/news/HeroSection";
import NewsGrid from "@/components/news/NewsGrid";
import BreakingNews from "@/components/news/BreakingNews";
import { newsApi } from "@/lib/api";
import { Zap, TrendingUp, Clock, Radio, Archive } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { mockLiveStreams } from "@/lib/mockLiveData";
import { mockArchivedStreams } from "@/lib/mockLiveData";
import LiveCard from "@/components/live/LiveCard";
import ArchiveCard from "@/components/archive/ArchiveCard";

export default async function HomePage() {
  const [latest, breaking] = await Promise.all([
    newsApi.getLatest(),
    newsApi.getBreaking(),
  ]);

  const [hero, ...rest] = latest.data;

  return (
    <div className="min-h-screen">
      {/* ─── نوار بالایی قرمز ───────────────────────────────────────── */}
      <div className="h-1 w-full bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      {/* ─── Breaking News ──────────────────────────────────────────── */}
      <BreakingNews articles={breaking} />

      {/* ─── محتوای اصلی ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 pb-16 mt-8 space-y-14">
        {/* Hero */}
        <section className="relative">
          <div
            className="absolute -inset-4 rounded-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.06) 0%, transparent 70%)",
            }}
          />
          <HeroSection article={hero} />
        </section>

        {/* ─── پخش زنده ──────────────────────────────────────────── */}
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
                <h2 className="text-2xl font-black leading-none text-gray-900">
                  پخش زنده
                </h2>
                <p className="text-[11px] text-red-500 font-semibold tracking-widest mt-0.5">
                  LIVE STREAMS
                </p>
              </div>
            </div>

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
              <span className="text-xs text-red-600 font-semibold">
                {mockLiveStreams.filter((s) => s.isLive).length} زنده
              </span>
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
            {mockLiveStreams.slice(0, 3).map((stream) => (
              <LiveCard key={stream.id} stream={stream} />
            ))}
          </div>
        </section>

        {/* ─── آخرین اخبار ──────────────────────────────────────────── */}
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
                <h2 className="text-2xl font-black leading-none text-gray-900">
                  آخرین اخبار
                </h2>
                <p className="text-[11px] text-red-500 font-semibold tracking-widest mt-0.5">
                  LATEST NEWS
                </p>
              </div>
            </div>

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
              <span className="text-xs text-red-600 font-semibold">زنده</span>
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

        {/* ─── آرشیو ─────────────────────────────────────────── */}
        <section className="relative">
          <div
            className="absolute -inset-6 rounded-3xl pointer-events-none"
            style={{
              background: "rgba(220,38,38,0.03)",
              border: "1px solid rgba(220,38,38,0.08)",
            }}
          />

          <div className="relative">
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
                <h2 className="text-2xl font-black leading-none text-gray-900">
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
              {mockArchivedStreams.slice(0, 3).map((stream) => (
                <ArchiveCard key={stream.id} stream={stream} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── پربازدیدترین ─────────────────────────────────────────── */}
        <section className="relative">
          <div
            className="absolute -inset-6 rounded-3xl pointer-events-none"
            style={{
              background: "rgba(220,38,38,0.03)",
              border: "1px solid rgba(220,38,38,0.08)",
            }}
          />

          <div className="relative">
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
                <h2 className="text-2xl font-black leading-none text-gray-900">
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
          </div>
        </section>
      </main>
    </div>
  );
}
