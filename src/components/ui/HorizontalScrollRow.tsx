"use client";

import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  children: React.ReactNode;
  desktopOnly?: boolean;
}

const CARD_WIDTH = 300;
const GAP = 24;

export default function HorizontalScrollRow({
  children,
  desktopOnly = true,
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "prev" | "next") => {
    const row = rowRef.current;
    if (!row) return;
    const amount = CARD_WIDTH + GAP;
    row.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <div className="relative">
        {/* Desktop scroll buttons */}
        <button
          onClick={() => scroll("next")}
          className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors group cursor-pointer"
          aria-label="بعدی"
        >
          <ChevronRight size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>
        <button
          onClick={() => scroll("prev")}
          className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors group cursor-pointer"
          aria-label="قبلی"
        >
          <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" />
        </button>

        <div
          ref={rowRef}
          className={`${
            desktopOnly ? "hidden lg:flex" : "flex"
          } overflow-x-auto gap-6 pb-4 scroll-smooth`}
          style={{ scrollbarWidth: "thin" }}
        >
          {children}
        </div>
      </div>

      {desktopOnly && (
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      )}
    </>
  );
}
