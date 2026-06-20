export const revalidate = 10;

// app/category/[slug]/page.tsx
import { newsApi, liveApi, archiveApi } from "@/lib/api";
import NewsGrid from "@/components/news/NewsGrid";
import LiveCard from "@/components/live/LiveCard";
import ArchiveCard from "@/components/archive/ArchiveCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { notFound } from "next/navigation";
import { categoryApi } from "@/lib/api";
import { Category, Article, LiveStream, ArchivedStream } from "@/types/news";

const ARTICLES_PER_PAGE = 12;

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await props.params;
  const { page: pageStr } = await props.searchParams;
  const currentPage = Math.max(1, Number(pageStr) || 1);

  // ─── گرفتن اطلاعات کتگوری از API ───
  let category: Category | undefined;
  try {
    category = await categoryApi.getBySlug(slug);
  } catch {
    notFound();
  }

  if (!category) notFound();

  // ─── گرفتن مقالات این دسته‌بندی ───
  let articles: Article[] = [];
  let totalArticles = 0;
  let totalPages = 1;
  try {
    const res = await newsApi.getByCategory(slug, currentPage, ARTICLES_PER_PAGE);
    articles = res.data || [];
    totalArticles = res.total || 0;
    totalPages = res.totalPages || 1;
  } catch {
    articles = [];
  }

  // ─── گرفتن پخش‌های زنده این دسته‌بندی ───
  let categoryLives: LiveStream[] = [];
  try {
    const allLives = await liveApi.getActive();
    categoryLives = allLives.filter(
      (live) => live.category?.slug === slug || live.categories?.some((c) => c.slug === slug)
    );
  } catch {
    categoryLives = [];
  }

  // ─── گرفتن آرشیوهای این دسته‌بندی ───
  let archives: ArchivedStream[] = [];
  try {
    const res = await archiveApi.getByCategory(slug);
    archives = (res.data || []).filter(Boolean);
  } catch {
    archives = [];
  }

  return (
    <div className="space-y-8">
      {/* ─── هدر مینیمال دسته‌بندی ─── */}
      <div className="flex items-center gap-4 pb-2 border-b border-gray-100 dark:border-gray-700">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #1099a6, #0d7a85)",
          }}
        >
          <span className="text-white text-lg font-black">
            {category.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">
            {category.name}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {[
              totalArticles > 0 && `${totalArticles.toLocaleString("fa-IR")} خبر`,
              archives.length > 0 && `${archives.length.toLocaleString("fa-IR")} آرشیو`,
              categoryLives.length > 0 && `${categoryLives.length.toLocaleString("fa-IR")} پخش زنده`,
            ].filter(Boolean).join(" • ")}
          </p>
        </div>
      </div>

      {/* ─── پخش‌های زنده ─── */}
      {categoryLives.length > 0 && (
        <ScrollReveal direction="up">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              پخش زنده
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryLives.slice(0, 4).map((live) => (
                <LiveCard key={live.id} stream={live} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ─── آرشیوها ─── */}
      {archives.length > 0 && (
        <ScrollReveal direction="up">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              آرشیوها
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {archives.slice(0, 8).map((archive) => (
                <ArchiveCard key={archive.id} stream={archive} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ─── مقالات ─── */}
      {articles.length > 0 ? (
        <>
          <NewsGrid articles={articles} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/category/${slug}`}
          />
        </>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-gray-400 text-lg">
            خبری در این دسته‌بندی یافت نشد
          </p>
        </div>
      )}
    </div>
  );
}

// ─── SEO ───
export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  try {
    const category = await categoryApi.getBySlug(slug);
    return {
      title: `${category.name} | خبرگزاری`,
      description: `آخرین اخبار و مقالات دسته‌بندی ${category.name}`,
    };
  } catch {
    return {
      title: "دسته‌بندی یافت نشد",
      description: "متاسفانه دسته‌بندی مورد نظر یافت نشد.",
    };
  }
}
