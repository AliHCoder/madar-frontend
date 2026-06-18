// types/news.ts

// ─── اینترفیس پایه برای دسته‌بندی ────────────────────────────────
export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  nameEn: string;
  color: string;
  parent?: string | Category | null;
  children?: Category[];
  order?: number;
}

// ─── اینترفیس مقاله خبری ─────────────────────────────────────────
export interface Article {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
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
  newsCode?: string;
  sourceUrl?: string;
  averageRating?: number;
  ratingCount?: number;
}

// ─── اینترفیس پخش زنده ───────────────────────────────────────────
export interface LiveStream {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  content?: string;
  thumbnail: string;
  category?: Category;
  categories?: Category[];
  startTime: string;
  isLive: boolean;
  viewers: number;
  streamUrl: string;
  embedUrl?: string;
  chatEnabled?: boolean;
  status: "live" | "upcoming" | "ended";
  averageRating?: number;
  ratingCount?: number;
}

// ─── اینترفیس ویدیوی آرشیوی ──────────────────────────────────────
export interface ArchivedStream {
  id: string;
  _id?: string;
  title: string;
  subtitle?: string;
  description: string;
  content?: string;
  thumbnail: string;
  category?: Category;
  categories?: Category[];
  recordedAt: string;
  duration: number;
  views: number;
  videoUrl: string;
  embedUrl?: string;
  quality?: "720p" | "1080p" | "4K";
  highlights?: string[];
  showHighlights?: boolean;
  showRecordedAt?: boolean;
  averageRating?: number;
  ratingCount?: number;
}

// ─── نوع محتوا ───────────────────────────────────────────────────
export type ContentType = "article" | "live" | "archive";

// ─── آیتم هیرو (مخلوطی از مقاله و آرشیو) ──────────────────────────
export interface HeroItem {
  id: string;
  title: string;
  image: string;
  author: string;
  link: string;
  type: ContentType;
}

// ─── پاسخ API ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
