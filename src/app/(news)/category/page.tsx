export const revalidate = 15;

// app/categories/page.tsx
import { categoryApi, newsApi, archiveApi, liveApi } from "@/lib/api";
import ScrollReveal from "@/components/animations/ScrollReveal";
import NewsGrid from "@/components/news/NewsGrid";
import ArchiveCard from "@/components/archive/ArchiveCard";
import LiveCard from "@/components/live/LiveCard";
import { Category, Article, ArchivedStream, LiveStream } from "@/types/news";
import { LayoutGrid, ChevronLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CategoryWithItems {
  category: Category;
  articles: Article[];
  archives: ArchivedStream[];
  lives: LiveStream[];
  totalArticles: number;
  totalArchives: number;
}

export default async function CategoriesPage() {
  // گرفتن همه کتگوری‌ها
  let categories: Category[] = [];
  try {
    categories = await categoryApi.getAll();
  } catch {
    categories = [];
  }

  // گرفتن همه پخش‌های زنده برای فیلتر بر اساس کتگوری
  let allLives: LiveStream[] = [];
  try {
    allLives = await liveApi.getActive();
  } catch {}

  // گرفتن مقاله‌ها، آرشیوها و پخش‌های زنده برای هر کتگوری
  const categoriesWithItems: CategoryWithItems[] = await Promise.all(
    categories.map(async (cat) => {
      let articles: Article[] = [];
      let totalArticles = 0;
      let archives: ArchivedStream[] = [];
      let totalArchives = 0;
      try {
        const res = await newsApi.getByCategory(cat.slug, 1, 6);
        articles = res.data || [];
        totalArticles = res.total || 0;
      } catch {}

      try {
        const res = await archiveApi.getByCategory(cat.slug, 1, 4);
        archives = (res.data || []).filter(Boolean);
        totalArchives = res.total || 0;
      } catch {}

      const lives = allLives.filter(
        (live) => live.category?.slug === cat.slug || live.categories?.some((c) => c.slug === cat.slug)
      );

      return { category: cat, articles, archives, lives, totalArticles, totalArchives };
    }),
  );

  const nonEmptyCategories = categoriesWithItems.filter(
    c => c.articles.length > 0 || c.archives.length > 0 || c.lives.length > 0
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pb-16 mt-8 space-y-14">
        {/* ─── سکشن‌های هر دسته‌بندی ─── */}
        {nonEmptyCategories.length > 0 ? (
          nonEmptyCategories.map((catData, index) => (
            <ScrollReveal
              key={catData.category.id}
              direction="up"
              delay={index * 0.1}
            >
              <section className="relative">
                {/* هدر سکشن */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-gray-100">
                          {catData.category.name}
                        </h2>
                      </div>
                      {/* آیکون external-link کنار اسم دسته‌بندی */}
                      <Link
                        href={`/category/${catData.category.slug}`}
                        className="flex-shrink-0 p-1.5 rounded-lg transition-all duration-300 hover:scale-110"
                        title={`مشاهده صفحه ${catData.category.name}`}
                      >
                        <ExternalLink
                          size={20}
                          style={{ color: "#1099a6" }}
                          className="opacity-60 hover:opacity-100 transition-opacity"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* دکمه نمایش همه */}
                  {catData.totalArticles > 6 && (
                    <Link
                      href={`/category/${catData.category.slug}`}
                      className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:shadow-lg flex-shrink-0"
                      style={{
                        backgroundColor: "rgba(16,153,166,0.1)",
                        border: "1px solid rgba(16,153,166,0.4)",
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ color: "#1099a6" }}
                      >
                        نمایش همه
                      </span>
                      <ChevronLeft
                        size={16}
                        style={{ color: "#1099a6" }}
                        className="transition-transform group-hover:-translate-x-1"
                      />
                      <span
                        className="text-xs opacity-70"
                        style={{ color: "#1099a6" }}
                      >
                        {catData.totalArticles.toLocaleString("fa-IR")}
                      </span>
                    </Link>
                  )}
                </div>

                {/* خط جداکننده با رنگ داینامیک */}
                <div
                  className="w-full h-px mb-8"
                  style={{
                    background: "linear-gradient(90deg, #1099a6 0%, rgba(16,153,166,0.3) 50%, transparent 100%)",
                  }}
                />

                {/* پخش‌های زنده */}
                {catData.lives.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      پخش زنده
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catData.lives.slice(0, 4).map((live) => (
                        <LiveCard key={live.id} stream={live} />
                      ))}
                    </div>
                  </div>
                )}

                {/* مقالات */}
                {catData.articles.length > 0 && (
                  <>
                    <NewsGrid articles={catData.articles.slice(0, 6)} />

                    {catData.totalArticles > 6 && (
                      <div className="mt-6 text-center lg:hidden">
                        <Link
                          href={`/category/${catData.category.slug}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg"
                          style={{
                            backgroundColor: "rgba(16,153,166,0.1)",
                            border: "1px solid rgba(16,153,166,0.4)",
                          }}
                        >
                          <span
                            className="text-sm font-bold"
                            style={{ color: "#1099a6" }}
                          >
                            نمایش همه اخبار {catData.category.name}
                          </span>
                          <ChevronLeft size={18} style={{ color: "#1099a6" }} />
                        </Link>
                      </div>
                    )}
                  </>
                )}

                {/* آرشیوها */}
                {catData.archives.length > 0 && (
                  <div className="mt-6">
                    {catData.articles.length > 0 && (
                      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4">
                        آرشیوهای {catData.category.name}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {catData.archives.slice(0, 4).map((archive) => (
                        <ArchiveCard key={archive.id} stream={archive} />
                      ))}
                    </div>
                  </div>
                )}

              </section>
            </ScrollReveal>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              هیچ دسته‌بندی یافت نشد
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// SEO Metadata
export async function generateMetadata() {
  return {
    title: "دسته‌بندی‌ها | خبرگزاری",
    description:
      "همه دسته‌بندی‌های خبری را مرور کنید. آخرین اخبار حوزه‌های مختلف سیاسی، اقتصادی، ورزشی، فرهنگی و...",
  };
}
