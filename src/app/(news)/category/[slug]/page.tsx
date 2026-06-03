export const dynamic = "force-dynamic";

// app/category/[slug]/page.tsx
import { newsApi } from "@/lib/api";
import NewsGrid from "@/components/news/NewsGrid";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { notFound } from "next/navigation";
import { categoryApi } from "@/lib/api";
import { Category, Article } from "@/types/news";

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

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
  try {
    const res = await newsApi.getByCategory(slug);
    articles = res.data || [];
  } catch {
    articles = [];
  }

  return (
    <div className="space-y-8">
      <ScrollReveal direction="up">
        {/* ─── هدر دسته‌بندی ─── */}
        <div
          className="relative text-center py-14 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
        >
          {/* دکوراسیون رنگی */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, ${category.color}, ${category.color}99, ${category.color})`,
            }}
          />
          <div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 dark:opacity-20"
            style={{ backgroundColor: category.color }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20 dark:opacity-10"
            style={{ backgroundColor: category.color }}
          />

          {/* آیکون کتگوری */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10"
            style={{
              background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)`,
              boxShadow: `0 0 30px ${category.color}40`,
            }}
          >
            <span className="text-3xl text-white font-black">
              {category.name.charAt(0)}
            </span>
          </div>

          {/* عنوان */}
          <h1 className="text-4xl font-extrabold mb-3 relative z-10 text-gray-900 dark:text-white">
            {category.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 relative z-10">
            <span className="font-bold" style={{ color: category.color }}>
              {articles.length}
            </span>{" "}
            خبر در این دسته‌بندی
          </p>
        </div>
      </ScrollReveal>

      {/* ─── مقالات ─── */}
      {articles.length > 0 ? (
        <NewsGrid articles={articles} />
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📭</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-lg">
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
