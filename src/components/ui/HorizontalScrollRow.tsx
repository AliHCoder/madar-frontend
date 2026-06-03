"use client";

import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalScrollRow({
  children,
}: {
  children: React.ReactNode;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "prev" | "next") => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.firstElementChild;
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = 24;
    const amount = cardWidth + gap;
    row.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => scroll("next")}
        className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors group cursor-pointer flex"
        aria-label="بعدی"
      >
        <ChevronRight size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" />
      </button>
      <button
        onClick={() => scroll("prev")}
        className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors group cursor-pointer flex"
        aria-label="قبلی"
      >
        <ChevronLeft size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" />
      </button>

      <div
        ref={rowRef}
        className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {children}
      </div>
    </div>
  );
}
