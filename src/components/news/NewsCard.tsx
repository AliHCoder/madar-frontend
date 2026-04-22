"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Clock, User } from "lucide-react";
import { Article } from "@/types/news";
import ScrollReveal from "../animations/ScrollReveal";

const categoryColors: Record<string, string> = {
  politics: "bg-red-600",
  tech: "bg-black",
  sports: "bg-red-800",
  economy: "bg-gray-900",
  world: "bg-red-700",
};

export default function NewsCard({
  article,
  delay = 0,
}: {
  article: Article;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: "0 20px 40px rgba(220,38,38,0.15)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <ScrollReveal delay={delay} direction="up">
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Link href={`/article/${article.id}`}>
          {/* تصویر */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={"/assets/images/png/test.jpg"}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* overlay قرمز تیره */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent" />

            {/* برچسب دسته‌بندی */}
            <span
              className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full ${
                categoryColors[article.category] || "bg-gray-800"
              }`}
            >
              {article.category}
            </span>
          </div>

          {/* محتوا */}
          <div className="p-5">
            <h3 className="text-gray-900 font-bold text-lg leading-snug mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
              {article.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
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
