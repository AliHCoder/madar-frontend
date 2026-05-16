// types/news.ts

// ─── اینترفیس پایه برای دسته‌بندی ────────────────────────────────
export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  nameEn: string;
  color: string;
}

// ─── اینترفیس مقاله خبری ─────────────────────────────────────────
export interface Article {
  id: string;
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: Category;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  views: number;
  isBreaking: boolean;
  isLive?: boolean;
  liveUrl?: string;
}

// ─── اینترفیس پخش زنده ───────────────────────────────────────────
export interface LiveStream {
  id: string;
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  category: Category;
  startTime: string;
  isLive: boolean;
  viewers: number;
  streamUrl: string;
  embedUrl?: string;
  chatEnabled?: boolean;
  status: "live" | "upcoming" | "ended";
}

// ─── اینترفیس ویدیوی آرشیوی ──────────────────────────────────────
export interface ArchivedStream {
  id: string;
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  category: Category;
  recordedAt: string;
  duration: number;
  views: number;
  videoUrl: string;
  embedUrl?: string;
  quality?: "720p" | "1080p" | "4K";
  highlights?: string[];
}

// ─── نوع محتوا ───────────────────────────────────────────────────
export type ContentType = "article" | "live" | "archive";

// ─── پاسخ API ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
