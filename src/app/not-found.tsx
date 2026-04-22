// NotFound.tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nf-num",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1,0.5)" },
      );
      gsap.fromTo(
        ".nf-text",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.4 },
      );
      gsap.fromTo(
        ".nf-btn",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.6 },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6"
    >
      {/* عدد ۴۰۴ */}
      <h1
        className="nf-num text-9xl font-black text-transparent select-none"
        style={{
          WebkitTextStroke: "3px rgb(220,38,38)",
          textShadow: "0 0 40px rgba(220,38,38,0.15)",
        }}
      >
        ۴۰۴
      </h1>

      {/* متن */}
      <div className="nf-text space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">صفحه پیدا نشد</h2>
        <p className="text-gray-400 text-sm">
          صفحه‌ای که دنبالش می‌گشتی وجود ندارد یا حذف شده.
        </p>
      </div>

      {/* دکمه */}
      <div className="nf-btn">
        <Link href="/">
          <Button size="lg">بازگشت به خانه</Button>
        </Link>
      </div>
    </div>
  );
}
