export const revalidate = 60;

// app/article/[id]/page.tsx
import { MyImage } from "@/components/ui/MyImage";
import { notFound } from "next/navigation";
import { newsApi, commentApi } from "@/lib/api";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import SidebarLatest from "@/components/news/SidebarLatest";
import CategoryBadge from "@/components/common/CategoryBadge";
import SharePrintButtons from "@/components/news/SharePrintButtons";
import CommentSection from "@/components/news/CommentSection";
import TagLink from "@/components/news/TagLink";
import ArticleRating from "@/components/news/ArticleRating";
import { Clock, User, Calendar, Tag, Hash, ExternalLink } from "lucide-react";

export default async function ArticlePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let article;
  let related;
  let initialComments: any[] = [];

  try {
    const [articleData, relatedData, commentsData] = await Promise.all([
      newsApi.getById(id),
      newsApi.getLatest(1, 6),
      commentApi.getByArticle(id).catch(() => []),
    ]);
    article = articleData;
    related = (relatedData.data || [])
      .filter((a) => a && a.id !== id)
      .slice(0, 5);
    initialComments = Array.isArray(commentsData) ? commentsData : [];
  } catch {
    notFound();
  }

  if (!article) notFound();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* ─── محتوای اصلی ─── */}
      <article className="lg:col-span-2 space-y-8">
        <ScrollReveal direction="up">
          <div className="space-y-4">
            {/* CategoryBadge */}
            {article.category && (
              <CategoryBadge
                category={article.category}
                variant="solid"
                size="md"
              />
            )}

            {/* عنوان */}
            <TextReveal
              text={article.title}
              className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight"
            />

            {/* زیرعنوان */}
            {article.subtitle && (
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* خلاصه */}
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              {article.excerpt}
            </p>

            {/* متادیتا */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 dark:text-gray-500 border-y border-gray-100 dark:border-gray-700 py-4">
              <span className="flex items-center gap-1.5">
                <User size={15} className="text-teal-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {article.author}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={15} className="text-teal-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {new Date(article.publishedAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-teal-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {article.readTime} دقیقه مطالعه
                </span>
              </span>
              {article.newsCode && (
                <span className="flex items-center gap-1.5">
                  <Hash size={15} className="text-teal-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">
                    {article.newsCode}
                  </span>
                </span>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* تصویر اصلی */}
        <ScrollReveal delay={0.1}>
          <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-lg">
            <MyImage
              src={article.image || "/assets/images/png/test.jpg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </ScrollReveal>

        {/* محتوای مقاله */}
        <ScrollReveal delay={0.2}>
          <div
            className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300
              prose-headings:text-gray-900 dark:prose-headings:text-gray-100
              prose-a:text-teal-600
              prose-strong:text-gray-900 dark:prose-strong:text-gray-100
              prose-code:text-teal-600
              prose-blockquote:border-teal-500
              leading-loose"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </ScrollReveal>

        {/* امتیاز */}
        <ScrollReveal delay={0.22}>
          <div className="border-t border-gray-100 dark:border-gray-700">
            <ArticleRating articleId={article.id} />
          </div>
        </ScrollReveal>

        {/* لینک منبع */}
        {article.sourceUrl && (
          <ScrollReveal delay={0.24}>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 transition-colors"
            >
              <ExternalLink size={14} />
              <span>منبع خبر</span>
            </a>
          </ScrollReveal>
        )}

        {/* اشتراک‌گذاری و چاپ */}
        <ScrollReveal delay={0.25}>
          <SharePrintButtons title={article.title} url={`/article/${article.id}`} />
        </ScrollReveal>

        {/* تگ‌ها */}
        {article.tags?.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Tag size={16} className="text-teal-500" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <TagLink key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* نشان Breaking */}
        {article.isBreaking && (
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-teal-600 dark:text-teal-400 font-bold text-sm">
              خبر فوری
            </span>
          </div>
        )}

        {/* لینک پخش زنده */}
        {article.isLive && article.liveUrl && (
          <div className="bg-teal-600 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-bold">پخش زنده این خبر</span>
            </div>
            <a
              href={article.liveUrl}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 rounded-xl text-sm font-bold hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
            >
              مشاهده پخش زنده
            </a>
          </div>
        )}

        {/* دیدگاه‌ها */}
        <CommentSection articleId={article.id} initialComments={initialComments} />
      </article>

      {/* ─── سایدبار ─── */}
      <aside className="space-y-8">
        <div className="sticky top-8">
          <SidebarLatest articles={related} />
        </div>
      </aside>
    </div>
  );
}

// ─── متادیتا ───
export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  try {
    const article = await newsApi.getById(id);
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: [article.image],
        type: "article",
        publishedTime: article.publishedAt,
        authors: [article.author],
        tags: article.tags,
      },
    };
  } catch {
    return {
      title: "مقاله یافت نشد",
      description: "متاسفانه مقاله مورد نظر یافت نشد.",
    };
  }
}
