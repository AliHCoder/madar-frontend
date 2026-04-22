// SearchBar.tsx
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
        className="flex items-center rounded-xl px-4 py-2.5 gap-3 transition-all duration-200"
        style={{
          background: "rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <Search size={16} className="text-gray-400 shrink-0" />
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
          className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="text-gray-400 hover:text-red-400 transition-colors duration-150"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* dropdown */}
      {open && query.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white rounded-xl overflow-hidden z-50"
          style={{
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          {loading ? (
            <div className="p-4 text-sm text-gray-400 text-center">
              در حال جستجو...
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-50">
              {results.slice(0, 6).map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/article/${article.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-red-50 group"
                  >
                    <Search
                      size={13}
                      className="text-gray-300 group-hover:text-red-400 shrink-0 transition-colors duration-150"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-red-600 line-clamp-1 transition-colors duration-150">
                      {article.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-400 text-center">
              نتیجه‌ای یافت نشد
            </div>
          )}
        </div>
      )}
    </div>
  );
}
