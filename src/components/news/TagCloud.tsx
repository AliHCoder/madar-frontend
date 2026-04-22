// TagCloud.tsx
"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import ScrollReveal from "../animations/ScrollReveal";

const tags = [
  "اقتصاد",
  "سیاست",
  "فناوری",
  "ورزش",
  "سینما",
  "سلامت",
  "محیط زیست",
  "علم",
  "هنر",
  "آموزش",
  "جهان",
  "داخلی",
  "بین الملل",
  "بورس",
  "دیپلماسی",
];

export default function TagCloud() {
  return (
    <ScrollReveal>
      <div
        className="bg-white rounded-2xl p-5"
        style={{
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        <h3 className="text-base font-bold mb-4 border-r-4 border-red-500 pr-3 text-gray-900">
          برچسب‌ها
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <TagItem key={tag} tag={tag} delay={i * 0.03} />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function TagItem({ tag, delay }: { tag: string; delay: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={ref}
      href={`/tag/${encodeURIComponent(tag)}`}
      onMouseEnter={() => gsap.to(ref.current, { scale: 1.06, duration: 0.18 })}
      onMouseLeave={() => gsap.to(ref.current, { scale: 1, duration: 0.18 })}
      className="inline-block text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-200 text-gray-600 hover:text-red-600"
      style={{
        background: "rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {tag}
    </Link>
  );
}
