"use client";
import { useState, useEffect, useCallback } from "react";
import { newsApi } from "@/lib/api";
import { Article } from "@/types/news";

export function useNews(category?: string) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const res = category
          ? await newsApi.getByCategory(category, currentPage)
          : await newsApi.getLatest(currentPage);

        setArticles((prev) => (reset ? res.data : [...prev, ...res.data]));
        setHasMore(res.data.length === 10);
        if (reset) setPage(1);
      } catch {
        setError("خطا در دریافت اخبار");
      } finally {
        setLoading(false);
      }
    },
    [category, page],
  );

  useEffect(() => {
    fetchNews(true);
  }, [category]);

  const loadMore = () => {
    setPage((p) => p + 1);
    fetchNews();
  };

  return { articles, loading, error, loadMore, hasMore };
}
