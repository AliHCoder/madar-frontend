"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "dots")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "dots") {
      pages.push("dots");
    }
  }

  const href = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  return (
    <div className="flex items-center justify-center gap-2 py-8" dir="ltr">
      {currentPage > 1 && (
        <Link
          href={href(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
      )}

      {pages.map((p, i) =>
        p === "dots" ? (
          <span
            key={`dots-${i}`}
            className="px-2 text-gray-400 dark:text-gray-500"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-xl text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-[#1099a6] text-white shadow-lg shadow-[#1099a6]/25"
                : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={href(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </div>
  );
}
