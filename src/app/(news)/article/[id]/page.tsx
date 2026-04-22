import Image from "next/image";
import { notFound } from "next/navigation";
import { newsApi } from "@/lib/api";
import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import SidebarLatest from "@/components/news/SidebarLatest";
import Badge from "@/components/ui/Badge";
import { Clock, User, Calendar } from "lucide-react";

export default async function ArticlePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let article;
  let related;

  try {
    const [articleData, relatedData] = await Promise.all([
      newsApi.getById(id),
      newsApi.getLatest(1, 6),
    ]);
    article = articleData;
    related = relatedData.data;
  } catch {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <article className="lg:col-span-2 space-y-8">
        <ScrollReveal direction="up">
          <div className="space-y-4">
            <Badge label={article.category} color="red" size="md" />
            <TextReveal
              text={article.title}
              className="text-3xl md:text-4xl font-extrabold text-gray-900  leading-tight"
            />
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 border-y border-gray-100 dark:border-gray-800 py-4">
              <span className="flex items-center gap-1.5">
                <User size={15} />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={15} />
                {new Date(article.publishedAt).toLocaleDateString("fa-IR")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                {article.readTime} دقیقه مطالعه
              </span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden">
            <Image
              src={"/assets/images/png/test.jpg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div
            className="prose prose-lg dark:prose-invert max-w-none text-gray-700 leading-loose"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </ScrollReveal>

        {article.tags?.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              {article.tags.map((tag) => (
                <Badge key={tag} label={tag} color="gray" />
              ))}
            </div>
          </ScrollReveal>
        )}
      </article>

      <aside className="space-y-8">
        <SidebarLatest articles={related} />
      </aside>
    </div>
  );
}
