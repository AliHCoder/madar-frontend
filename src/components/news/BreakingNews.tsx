"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Article } from "@/types/news";
import Link from "next/link";

export default function BreakingNews({ articles }: { articles: Article[] }) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;

    const totalWidth = el.scrollWidth / 2;

    animRef.current = gsap.to(el, {
      x: -totalWidth,
      duration: articles.length * 6,
      ease: "none",
      repeat: -1,
    });

    return () => {
      animRef.current?.kill();
    };
  }, [articles]);

  const doubled = [...articles, ...articles];

  return (
    <div
      className="relative flex items-center overflow-hidden"
      style={{
        height: "42px",
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(220,38,38,0.15)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* برچسب فوری - شیشه‌ای */}
      <div
        className="shrink-0 flex items-center gap-2 px-5 h-full z-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,38,38,0.9), rgba(153,27,27,0.9))",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "inset -1px 0 0 rgba(255,255,255,0.05), 2px 0 12px rgba(0,0,0,0.3)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
          style={{ boxShadow: "0 0 6px rgba(255,255,255,0.8)" }}
        />
        <span className="text-white font-bold text-xs tracking-[0.15em]">
          فوری
        </span>
      </div>

      {/* ticker wrapper */}
      <div
        className="flex-1 overflow-hidden relative flex items-center h-full"
        onMouseEnter={() => animRef.current?.pause()}
        onMouseLeave={() => animRef.current?.resume()}
      >
        {/* fade چپ */}
        <div
          className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,10,0.95), transparent)",
          }}
        />

        <div ref={tickerRef} className="flex items-center whitespace-nowrap">
          {doubled.map((article, i) => (
            <Link
              href={`/article/${article.id}`}
              key={i}
              className="inline-flex items-center gap-3 px-8 group"
            >
              <span
                className="w-1 h-1 rounded-full shrink-0"
                style={{ background: "rgba(220,38,38,0.7)" }}
              />
              <span
                className="text-sm font-light tracking-wide transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                <span className="group-hover:text-white transition-colors duration-300">
                  {article.title}
                </span>
              </span>
            </Link>
          ))}
        </div>

        {/* fade راست */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgba(10,10,10,0.95), transparent)",
          }}
        />
      </div>

      {/* دکمه همه اخبار */}
      <Link
        href="/breaking"
        className="shrink-0 flex items-center gap-2 px-5 h-full z-20 group transition-all duration-300"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span
          className="text-xs font-medium tracking-wide transition-colors duration-300"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <span className="group-hover:text-red-400 transition-colors duration-300">
            همه اخبار
          </span>
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-red-600 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-0.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>
    </div>
  );
}
