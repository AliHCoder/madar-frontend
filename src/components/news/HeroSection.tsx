"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Article } from "@/types/news";
import { Clock, User, Tag } from "lucide-react";

export default function HeroSection({ article }: { article: Article }) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
      );
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" },
      );
      gsap.fromTo(
        ".hero-excerpt",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: "power3.out" },
      );
      gsap.fromTo(
        ".hero-meta",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.6 },
      );
    }, heroRef);

    return () => ctx.revert();
  }, [article]);

  return (
    <div
      ref={heroRef}
      className="relative w-full h-[70vh] min-h-[520px] rounded-3xl overflow-hidden group"
      style={{
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(220,38,38,0.1)",
      }}
    >
      {/* تصویر */}
      <Image
        src={"/assets/images/png/test.jpg"}
        alt={article.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />

      {/* لایه گرادیان اصلی */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* لایه گرادیان قرمز ظریف */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(153,27,27,0.35) 0%, transparent 60%)",
        }}
      />

      {/* خط قرمز پایین */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, transparent, #dc2626, rgba(255,255,255,0.4), #dc2626, transparent)",
        }}
      />

      {/* محتوا */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        {/* badge دسته‌بندی */}
        <div className="hero-badge flex items-center gap-2 mb-4 w-fit">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(220,38,38,0.85)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 0 16px rgba(220,38,38,0.5)",
            }}
          >
            <Tag size={11} className="text-white" />
            <span className="text-white text-xs font-bold tracking-wide">
              {article.category}
            </span>
          </div>

          {/* نشانگر زنده */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
              style={{ boxShadow: "0 0 6px rgba(220,38,38,0.9)" }}
            />
            <span className="text-white text-xs font-medium">ویژه</span>
          </div>
        </div>

        {/* عنوان */}
        <Link href={`/article/${article.id}`}>
          <h1
            className="hero-title text-white text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl transition-colors duration-300 cursor-pointer"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            <span className="hover:text-red-300 transition-colors duration-300">
              {article.title}
            </span>
          </h1>
        </Link>

        {/* خلاصه */}
        <p
          className="hero-excerpt text-gray-300 text-base md:text-lg max-w-2xl mb-6 line-clamp-2 leading-relaxed"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
        >
          {article.excerpt}
        </p>

        {/* متا */}
        <div
          className="hero-meta flex flex-wrap items-center gap-3 md:gap-5"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "16px",
          }}
        >
          {/* نویسنده */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(220,38,38,0.6)" }}
            >
              <User size={11} className="text-white" />
            </div>
            <span className="text-gray-300 text-sm font-medium">
              {article.author}
            </span>
          </div>

          {/* جداکننده */}
          <span
            className="w-px h-4"
            style={{ background: "rgba(255,255,255,0.2)" }}
          />

          {/* تاریخ */}
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-red-400" />
            <span className="text-gray-400 text-sm">
              {new Date(article.publishedAt).toLocaleDateString("fa-IR")}
            </span>
          </div>

          {/* جداکننده */}
          <span
            className="w-px h-4"
            style={{ background: "rgba(255,255,255,0.2)" }}
          />

          {/* زمان مطالعه */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <span className="text-gray-300 font-medium">
              {article.readTime} دقیقه مطالعه
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
