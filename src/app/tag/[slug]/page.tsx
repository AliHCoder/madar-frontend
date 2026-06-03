export const dynamic = "force-dynamic";

import { tagApi } from "@/lib/api";
import { notFound } from "next/navigation";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import NewsGrid from "@/components/news/NewsGrid";
import { Tag, Hash } from "lucide-react";

export default async function TagPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  let tag;
  let articles;
  try {
    [tag, articles] = await Promise.all([
      tagApi.getBySlug(slug),
      tagApi.getArticles(slug),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-10">
      <ScrollReveal direction="up">
        <div className="text-center space-y-3 py-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto">
            <Hash size={28} className="text-red-600 dark:text-red-400" />
          </div>
          <TextReveal
            text={`#${tag.name}`}
            className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white"
          />
          <p className="text-gray-500 dark:text-gray-400">
            {tag.count} مقاله با این تگ
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        {articles.data && articles.data.length > 0 ? (
          <NewsGrid articles={articles.data} />
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Tag size={48} className="mx-auto mb-3 opacity-50" />
            <p>هیچ مقاله‌ای با این تگ یافت نشد</p>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
