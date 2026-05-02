// components/news/CategorySection.tsx
"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { Article } from "@/types/news";
import NewsCard from "./NewsCard";
import ScrollReveal from "../animations/ScrollReveal";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  slug: string;
  articles: Article[];
  color?: string;
}

export default function CategorySection({
  title,
  slug,
  articles,
  color = "red",
}: Props) {
  const arrowRef = useRef<HTMLSpanElement>(null);

  const colorMap: Record<string, string> = {
    red: "border-red-500 text-red-600 dark:text-red-400",
    blue: "border-blue-500 text-blue-600 dark:text-blue-400",
    green: "border-green-500 text-green-600 dark:text-green-400",
    yellow: "border-yellow-500 text-yellow-600 dark:text-yellow-400",
    purple: "border-purple-500 text-purple-600 dark:text-purple-400",
  };

  return (
    <section className="space-y-6">
      <ScrollReveal direction="left">
        <div className="flex items-center justify-between">
          <h2
            className={`text-xl font-extrabold border-r-4 pr-4 text-gray-900 dark:text-white ${colorMap[color] ?? colorMap.red}`}
          >
            {title}
          </h2>
          <Link
            href={`/category/${slug}`}
            className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
            onMouseEnter={() =>
              gsap.to(arrowRef.current, { x: -4, duration: 0.2 })
            }
            onMouseLeave={() =>
              gsap.to(arrowRef.current, { x: 0, duration: 0.2 })
            }
          >
            مشاهده همه
            <span ref={arrowRef}>
              <ArrowLeft size={15} />
            </span>
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article, i) => (
          <NewsCard key={article.id} article={article} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
