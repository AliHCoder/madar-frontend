// components/search/SearchBar.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Search, X } from "lucide-react";
import { newsApi } from "@/lib/api";
import { Article } from "@/types/news";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await newsApi.search(query);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (open && dropdownRef.current && results.length > 0) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power3.out" },
      );
    }
  }, [results, open]);

  return (
    <div className="relative w-full max-w-xl">
      {/* input */}
      <div
        className="flex items-center rounded-xl px-4 py-2.5 gap-3 transition-all duration-200
          bg-black/[0.04] dark:bg-white/[0.06]
          border border-black/[0.07] dark:border-white/[0.1]
          focus-within:border-red-500/50 dark:focus-within:border-red-400/50
          focus-within:shadow-lg focus-within:shadow-red-500/10 dark:focus-within:shadow-red-400/10"
      >
        <Search
          size={16}
          className="text-gray-400 dark:text-gray-500 shrink-0"
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder="جستجو در اخبار..."
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400 transition-colors duration-150"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* dropdown */}
      {open && query.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden z-50
            border border-black/[0.07] dark:border-white/[0.1]"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
        >
          {loading ? (
            <div className="p-4 text-sm text-gray-400 dark:text-gray-500 text-center">
              در حال جستجو...
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-50 dark:divide-gray-800">
              {results.slice(0, 6).map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/article/${article.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 
                      hover:bg-red-50 dark:hover:bg-red-900/20 group"
                  >
                    <Search
                      size={13}
                      className="text-gray-300 dark:text-gray-600 group-hover:text-red-400 shrink-0 transition-colors duration-150"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-1 transition-colors duration-150">
                      {article.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-400 dark:text-gray-500 text-center">
              نتیجه‌ای یافت نشد
            </div>
          )}
        </div>
      )}
    </div>
  );
}
