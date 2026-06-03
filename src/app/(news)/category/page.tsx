export const dynamic = "force-dynamic";

// app/categories/page.tsx
import { categoryApi, newsApi } from "@/lib/api";
import ScrollReveal from "@/components/animations/ScrollReveal";
import NewsGrid from "@/components/news/NewsGrid";
import { Category, Article } from "@/types/news";
import { LayoutGrid, ChevronLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CategoryWithArticles {
  category: Category;
  articles: Article[];
  totalArticles: number;
}

export default async function CategoriesPage() {
  // گرفتن همه کتگوری‌ها
  let categories: Category[] = [];
  try {
    categories = await categoryApi.getAll();
  } catch {
    categories = [];
  }

  // گرفتن مقاله‌های preview برای هر کتگوری (۶ تا برای نمایش بهتر)
  const categoriesWithArticles: CategoryWithArticles[] = await Promise.all(
    categories.map(async (cat) => {
      try {
        const res = await newsApi.getByCategory(cat.slug, 1, 6);
        return {
          category: cat,
          articles: res.data || [],
          totalArticles: res.total || 0,
        };
      } catch {
        return {
          category: cat,
          articles: [],
          totalArticles: 0,
        };
      }
    }),
  );

  // فقط کتگوری‌های فعال
  const activeCategories = categoriesWithArticles.filter(
    (cat) => cat.totalArticles > 0,
  );

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 pb-16 mt-8 space-y-14">
        {/* ─── سکشن‌های هر دسته‌بندی ─── */}
        {activeCategories.length > 0 ? (
          activeCategories.map((catData, index) => (
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
                        <h2 className="text-2xl font-black leading-none text-gray-900 dark:text-white">
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
                          style={{ color: catData.category.color }}
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
                        backgroundColor: `${catData.category.color}10`,
                        border: `1px solid ${catData.category.color}40`,
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ color: catData.category.color }}
                      >
                        نمایش همه
                      </span>
                      <ChevronLeft
                        size={16}
                        style={{ color: catData.category.color }}
                        className="transition-transform group-hover:-translate-x-1"
                      />
                      <span
                        className="text-xs opacity-70"
                        style={{ color: catData.category.color }}
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
                    background: `linear-gradient(90deg, ${catData.category.color} 0%, ${catData.category.color}30 50%, transparent 100%)`,
                  }}
                />

                {/* استفاده از NewsGrid موجود */}
                {catData.articles.length > 0 ? (
                  <>
                    <NewsGrid articles={catData.articles.slice(0, 6)} />

                    {/* دکمه نمایش همه در پایین (برای موبایل) */}
                    {catData.totalArticles > 6 && (
                      <div className="mt-6 text-center lg:hidden">
                        <Link
                          href={`/category/${catData.category.slug}`}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg"
                          style={{
                            backgroundColor: `${catData.category.color}10`,
                            border: `1px solid ${catData.category.color}40`,
                          }}
                        >
                          <span
                            className="text-sm font-bold"
                            style={{ color: catData.category.color }}
                          >
                            نمایش همه اخبار {catData.category.name}
                          </span>
                          <ChevronLeft
                            size={18}
                            style={{ color: catData.category.color }}
                          />
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="text-center py-12 rounded-2xl"
                    style={{ backgroundColor: `${catData.category.color}05` }}
                  >
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      هنوز خبری در این دسته‌بندی منتشر نشده است
                    </p>
                  </div>
                )}
              </section>
            </ScrollReveal>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              هیچ دسته‌بندی فعالی یافت نشد
            </p>
          </div>
        )}
      </main>
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
