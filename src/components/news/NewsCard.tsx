// components/news/NewsCard.tsx
"use client";
import { useRef } from "react";
import { MyImage } from "@/components/ui/MyImage";
import Link from "next/link";
import { gsap } from "gsap";
import { Clock, User } from "lucide-react";
import { Article } from "@/types/news";
import ScrollReveal from "../animations/ScrollReveal";
import CategoryBadge from "@/components/common/CategoryBadge";

export default function NewsCard({
  article,
  delay = 0,
}: {
  article: Article;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollReveal delay={delay} direction="up">
      <div
        ref={cardRef}
        onMouseEnter={() =>
          gsap.to(cardRef.current, {
            y: -6,
            boxShadow: "0 20px 40px rgba(220,38,38,0.15)",
            duration: 0.3,
          })
        }
        onMouseLeave={() =>
          gsap.to(cardRef.current, {
            y: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            duration: 0.3,
          })
        }
        className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Link href={`/article/${article.id}`}>
          <div className="relative h-52 overflow-hidden">
            <MyImage
              src={article.image || "/assets/images/png/test.jpg"}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-3 right-3">
              <CategoryBadge
                category={article.category}
                variant="glass"
                size="sm"
              />
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-snug mb-3 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
              <span className="flex items-center gap-1">
                <User size={12} className="text-red-500" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-red-500" />
                {article.readTime} دقیقه
              </span>
            </div>
          </div>
        </Link>
      </div>
    </ScrollReveal>
  );
}
