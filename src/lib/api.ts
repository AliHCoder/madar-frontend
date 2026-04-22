import axios from "axios";
import { Article, ApiResponse } from "@/types/news";
import { mockArticles, getMockResponse } from "./mockData";

// ─── تشخیص خودکار: اگر API_URL تنظیم نشده، از Mock استفاده می‌کنیم ───
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK = !API_URL || API_URL === "your-api-url-here";

const api = axios.create({
  baseURL: API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ─── Mock helpers ──────────────────────────────────────────────────────────────
const mockDelay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const mockGetLatest = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<Article[]>> => {
  await mockDelay();
  const start = (page - 1) * limit;
  const sliced = mockArticles.slice(start, start + limit);
  return getMockResponse(sliced, mockArticles.length);
};

const mockGetById = async (id: string): Promise<Article> => {
  await mockDelay();
  const article = mockArticles.find((a) => a.id === id);
  if (!article) throw new Error("Article not found");
  return article;
};

const mockGetByCategory = async (
  slug: string,
  page = 1,
  limit = 10,
): Promise<ApiResponse<Article[]>> => {
  await mockDelay();
  const filtered = mockArticles.filter((a) => a.categorySlug === slug);
  const start = (page - 1) * limit;
  return getMockResponse(filtered.slice(start, start + limit), filtered.length);
};

const mockSearch = async (query: string): Promise<Article[]> => {
  await mockDelay(200);
  const q = query.toLowerCase();
  return mockArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags?.some((t) => t.toLowerCase().includes(q)),
  );
};

const mockGetBreaking = async (): Promise<Article[]> => {
  await mockDelay(150);
  return mockArticles.filter((a) => a.isBreaking);
};

// ─── API اصلی ─────────────────────────────────────────────────────────────────
export const newsApi = {
  getLatest: async (page = 1, limit = 10): Promise<ApiResponse<Article[]>> => {
    if (USE_MOCK) return mockGetLatest(page, limit);
    const { data } = await api.get(`/news?page=${page}&limit=${limit}`);
    return data;
  },

  getById: async (id: string): Promise<Article> => {
    if (USE_MOCK) return mockGetById(id);
    const { data } = await api.get(`/news/${id}`);
    return data;
  },

  getByCategory: async (
    slug: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<Article[]>> => {
    if (USE_MOCK) return mockGetByCategory(slug, page, limit);
    const { data } = await api.get(
      `/news/category/${slug}?page=${page}&limit=${limit}`,
    );
    return data;
  },

  search: async (query: string): Promise<Article[]> => {
    if (USE_MOCK) return mockSearch(query);
    const { data } = await api.get(
      `/news/search?q=${encodeURIComponent(query)}`,
    );
    return data;
  },

  getBreaking: async (): Promise<Article[]> => {
    if (USE_MOCK) return mockGetBreaking();
    const { data } = await api.get("/news/breaking");
    return data;
  },

  getFeatured: async (): Promise<Article[]> => {
    if (USE_MOCK) return mockArticles.slice(0, 5);
    const { data } = await api.get("/news/featured");
    return data;
  },

  getRelated: async (id: string, categorySlug: string): Promise<Article[]> => {
    if (USE_MOCK) {
      await mockDelay(200);
      return mockArticles
        .filter((a) => a.categorySlug === categorySlug && a.id !== id)
        .slice(0, 4);
    }
    const { data } = await api.get(`/news/${id}/related`);
    return data;
  },
};

export default api;
