export const revalidate = 30;

import HeroSection from "@/components/news/HeroSection";
import Link from "next/link";
import { newsApi, liveApi, archiveApi, heroApi, categoryApi } from "@/lib/api";
import {
  TrendingUp,
  Clock,
  Radio,
  Archive,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import HorizontalScrollRow from "@/components/ui/HorizontalScrollRow";
import NewsCard from "@/components/news/NewsCard";
import LiveCard from "@/components/live/LiveCard";
import ArchiveCard from "@/components/archive/ArchiveCard";
import type {
  Article,
  LiveStream,
  ArchivedStream,
  HeroItem,
  Category,
} from "@/types/news";

export default async function HomePage() {
  const [latestRes, liveRes, archiveRes, heroRes] = await Promise.allSettled([
    newsApi.getLatest(1, 10),
    liveApi.getActive(),
    archiveApi.getRecent(10),
    heroApi.getSettings(),
  ]);

  const latest =
    latestRes.status === "fulfilled" ? latestRes.value : { data: [], total: 0 };
  const safeLiveStreams: LiveStream[] =
    liveRes.status === "fulfilled" ? liveRes.value : [];
  const safeArchivedVideos: ArchivedStream[] =
    archiveRes.status === "fulfilled" ? archiveRes.value : [];
  const heroSettings = heroRes.status === "fulfilled" ? heroRes.value : null;

  const allArticles: Article[] = latest.data || [];

  // گرفتن کتگوری‌های منتخب صفحه اصلی
  let featuredCategories: Category[] = [];
  try {
    featuredCategories = await categoryApi.getHomepage();
  } catch {}

  // گرفتن مقالات، آرشیو و لایو هر کتگوری منتخب ─ مخلوط و مرتب بر اساس تاریخ
  interface MixedItem {
    type: "article" | "archive" | "live";
    data: Article | ArchivedStream | LiveStream;
    date: string;
  }

  const featuredSections = await Promise.all(
    featuredCategories.map(async (cat) => {
      const catSlug = cat.slug;

      const [articlesRes, archivesRes] = await Promise.allSettled([
        newsApi.getByCategory(catSlug, 1, 10),
        archiveApi.getByCategory(catSlug, 1, 10),
      ]);

      const articles: Article[] =
        articlesRes.status === "fulfilled" ? articlesRes.value.data || [] : [];
      const archives: ArchivedStream[] =
        archivesRes.status === "fulfilled"
          ? (archivesRes.value.data || []).filter(Boolean)
          : [];
      const lives = safeLiveStreams.filter(
        (l) =>
          l.category?.slug === catSlug ||
          l.categories?.some((c) => c.slug === catSlug),
      );

      const mixed: MixedItem[] = [
        ...articles.map((a) => ({
          type: "article" as const,
          data: a,
          date: a.publishedAt,
        })),
        ...archives.map((a) => ({
          type: "archive" as const,
          data: a,
          date: a.recordedAt,
        })),
        ...lives.map((l) => ({
          type: "live" as const,
          data: l,
          date: l.startTime,
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      return { category: cat, items: mixed };
    }),
  );

  const toHeroItem = (item: {
    type: "article" | "archive" | "live";
    data: any;
  }): HeroItem | null => {
    try {
      if (!item?.data) return null;
      const id = item.data._id || item.data.id;
      if (!id) return null;
      let link = `/article/${id}`;
      if (item.type === "archive") link = `/archive/${id}`;
      else if (item.type === "live") link = `/live/${id}`;
      const heroImage =
        item.data.image && !item.data.image.includes("/assets/images/png/")
          ? item.data.image
          : item.data.thumbnail || "";
      return {
        id,
        title: item.data.title || "",
        image: heroImage,
        author: item.data.author || "",
        link,
        type: item.type,
      };
    } catch {
      return null;
    }
  };

  const heroItems: HeroItem[] =
    heroSettings?.isActive && heroSettings.items.length > 0
      ? (heroSettings.items.map(toHeroItem).filter(Boolean) as HeroItem[])
      : allArticles.slice(0, 8).map((a) => ({
          id: a.id,
          title: a.title,
          image: a.image,
          author: a.author,
          link: `/article/${a.id}`,
          type: "article" as const,
        }));

  if (allArticles.length === 0 && heroItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-md">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📡</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            در حال بارگذاری
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            داده‌ای یافت نشد. ممکن است اتصال اینترنت شما قطع باشد.
          </p>
        </div>
      </div>
    );
  }

  const [hero, ...rest] = allArticles;
  const liveCount = safeLiveStreams.filter(
    (s) => s?.isLive || s?.status === "live",
  ).length;

  const liveList = safeLiveStreams.slice(0, 10);
  const MAX_ITEMS = 10;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pb-16 mt-8 space-y-10 md:space-y-14">
        <section className="relative">
          {heroItems.length > 0 && (
            <HeroSection
              topBanners={heroItems.slice(0, 2)}
              sideCards={heroItems.slice(2, 4)}
              sliderArticles={heroItems.slice(4, 8)}
            />
          )}
        </section>

        {safeLiveStreams.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #1099a6, #0d7a85)",
                    boxShadow:
                      "0 0 20px rgba(16,153,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Radio size={16} className="text-white" />
                </div>
                <div>
                  <Link href="/live">
                    <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-gray-100 hover:text-teal-500 transition-colors">
                      پخش زنده
                    </h2>
                    <p className="text-[11px] text-teal-500 font-semibold tracking-widest mt-0.5">
                      LIVE STREAMS
                    </p>
                  </Link>
                </div>
              </div>
              <Link
                href="/live"
                className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-500 transition-colors font-medium"
              >
                مشاهده همه
                <ChevronLeft size={16} />
              </Link>
              {/* {liveCount > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(16,153,166,0.08)",
                    border: "1px solid rgba(16,153,166,0.25)",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"
                    style={{ boxShadow: "0 0 6px rgba(16,153,166,0.7)" }}
                  />
                  <span className="text-xs text-teal-600 font-semibold">
                    {liveCount} زنده
                  </span>
                </div>
              )} */}
            </div>

            <div
              className="w-full h-px mb-6 md:mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #1099a6 0%, rgba(16,153,166,0.3) 50%, transparent 100%)",
              }}
            />

            <HorizontalScrollRow>
              {liveList.map((stream) => (
                <div
                  key={stream.id}
                  className="min-w-[260px] md:min-w-[300px] w-[260px] md:w-[300px] flex-shrink-0"
                >
                  <LiveCard stream={stream} />
                </div>
              ))}
            </HorizontalScrollRow>
          </section>
        )}

        {/* ─── سکشن‌های کتگوری‌های منتخب صفحه اصلی ─── */}
        {featuredSections.map(({ category, items }) =>
          items.length > 0 ? (
            <section key={category.id} className="relative">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #1099a6, #0d7a85)",
                      boxShadow:
                        "0 0 20px rgba(16,153,166,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  >
                    <span className="text-white text-sm font-black">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <Link href={`/category/${category.slug}`}>
                      <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-gray-100 hover:text-teal-500 transition-colors">
                        {category.name}
                      </h2>
                      <p
                        className="text-[11px] font-semibold tracking-widest mt-0.5 hover:text-teal-400 transition-colors"
                        style={{ color: "#1099a6" }}
                      >
                        {category.nameEn.toUpperCase()}
                      </p>
                    </Link>
                  </div>
                </div>
                <Link
                  href={`/category/${category.slug}`}
                  className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-500 transition-colors font-medium"
                >
                  مشاهده همه
                  <ChevronLeft size={16} />
                </Link>
              </div>

              <div
                className="w-full h-px mb-6 md:mb-8"
                style={{
                  background:
                    "linear-gradient(90deg, #1099a6 0%, rgba(16,153,166,0.3) 50%, transparent 100%)",
                }}
              />

              <HorizontalScrollRow>
                {items.map((item) => (
                  <div
                    key={`${item.type}-${item.data.id}`}
                    className="min-w-[260px] md:min-w-[300px] w-[260px] md:w-[300px] flex-shrink-0"
                  >
                    {item.type === "article" ? (
                      <NewsCard article={item.data as Article} delay={0} />
                    ) : item.type === "archive" ? (
                      <ArchiveCard stream={item.data as ArchivedStream} />
                    ) : (
                      <LiveCard stream={item.data as LiveStream} />
                    )}
                  </div>
                ))}
              </HorizontalScrollRow>
            </section>
          ) : null,
        )}

        {rest.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #1099a6, #0d7a85)",
                    boxShadow:
                      "0 0 20px rgba(16,153,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Clock size={16} className="text-white" />
                </div>
                <div>
                  <Link href="/search">
                    <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-gray-100 hover:text-teal-500 transition-colors">
                      آخرین اخبار
                    </h2>
                    <p className="text-[11px] text-teal-500 font-semibold tracking-widest mt-0.5">
                      LATEST NEWS
                    </p>
                  </Link>
                </div>
              </div>
              <Link
                href="/search"
                className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-500 transition-colors font-medium"
              >
                مشاهده همه
                <ArrowLeft size={16} />
              </Link>
            </div>

            <div
              className="w-full h-px mb-6 md:mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #1099a6 0%, rgba(16,153,166,0.3) 50%, transparent 100%)",
              }}
            />

            <HorizontalScrollRow>
              {rest.slice(0, MAX_ITEMS).map((article: Article) => (
                <div
                  key={article.id}
                  className="min-w-[260px] md:min-w-[300px] w-[260px] md:w-[300px] flex-shrink-0"
                >
                  <NewsCard article={article} delay={0} />
                </div>
              ))}
            </HorizontalScrollRow>
          </section>
        )}

        {safeArchivedVideos.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #1099a6, #0d7a85)",
                    boxShadow:
                      "0 0 20px rgba(16,153,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <Archive size={16} className="text-white" />
                </div>
                <div>
                  <Link href="/archive">
                    <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-gray-100 hover:text-teal-500 transition-colors">
                      آرشیو
                    </h2>
                    <p className="text-[11px] text-teal-500 font-semibold tracking-widest mt-0.5">
                      ARCHIVE
                    </p>
                  </Link>
                </div>
              </div>
              <Link
                href="/archive"
                className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-500 transition-colors font-medium"
              >
                مشاهده همه
                <ArrowLeft size={16} />
              </Link>
            </div>

            <div
              className="w-full h-px mb-6 md:mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #1099a6 0%, rgba(16,153,166,0.3) 50%, transparent 100%)",
              }}
            />

            <HorizontalScrollRow>
              {safeArchivedVideos.slice(0, 10).map((stream) =>
                stream ? (
                  <div
                    key={stream.id}
                    className="min-w-[260px] md:min-w-[300px] w-[260px] md:w-[300px] flex-shrink-0"
                  >
                    <ArchiveCard stream={stream} />
                  </div>
                ) : null,
              )}
            </HorizontalScrollRow>
          </section>
        )}

        {allArticles.length > 0 && (
          <section className="relative">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #1099a6, #0d7a85)",
                    boxShadow:
                      "0 0 20px rgba(16,153,166,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-gray-100">
                    پربازدیدترین
                  </h2>
                  <p className="text-[11px] text-teal-500 font-semibold tracking-widest mt-0.5">
                    TRENDING
                  </p>
                </div>
              </div>
            </div>

            <div
              className="w-full h-px mb-6 md:mb-8"
              style={{
                background:
                  "linear-gradient(90deg, #1099a6 0%, rgba(16,153,166,0.3) 50%, transparent 100%)",
              }}
            />

            <HorizontalScrollRow>
              {allArticles
                .slice(hero ? 1 : 0, MAX_ITEMS + (hero ? 1 : 0))
                .map((article: Article) => (
                  <div
                    key={article.id}
                    className="min-w-[260px] md:min-w-[300px] w-[260px] md:w-[300px] flex-shrink-0"
                  >
                    <NewsCard article={article} delay={0} />
                  </div>
                ))}
            </HorizontalScrollRow>
          </section>
        )}
      </div>
    </div>
  );
}
