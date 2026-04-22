import { newsApi } from "@/lib/api";
import NewsGrid from "@/components/news/NewsGrid";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { notFound } from "next/navigation";
import { categories } from "@/constants/categories";
import { Article } from "@/types/news";

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  let articles: Article[] = [];

  try {
    const res = await newsApi.getByCategory(slug);
    articles = res.data ?? [];
  } catch {
    articles = [];
  }

  return (
    <div className="space-y-8">
      <ScrollReveal direction="up">
        {/* هدر دسته‌بندی */}
        <div
          className="relative text-center py-14 bg-white rounded-3xl overflow-hidden border border-gray-100"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
        >
          {/* دکوراسیون قرمز */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-50 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-50 rounded-full blur-3xl" />

          <span className="text-5xl mb-4 block relative z-10">
            {category.icon}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 relative z-10">
            {category.name}
          </h1>
          <p className="text-gray-400 relative z-10">
            <span className="text-red-500 font-bold">{articles.length}</span>{" "}
            خبر در این دسته‌بندی
          </p>
        </div>
      </ScrollReveal>

      {articles.length > 0 ? (
        <NewsGrid articles={articles} />
      ) : (
        <div className="text-center py-20 text-gray-400">
          خبری در این دسته‌بندی یافت نشد
        </div>
      )}
    </div>
  );
}
