// types/news.ts

// ─── اینترفیس پایه برای دسته‌بندی ────────────────────────────────
export interface Category {
  id: string;
  name: string; // نام فارسی مثل "سیاسی"
  slug: string; // شناسه انگلیسی مثل "politics"
  nameEn: string; // نام انگلیسی مثل "Politics"
  color: string; // کد رنگ مثل "#dc2626"
}

// ─── اینترفیس مقاله خبری ─────────────────────────────────────────
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: Category; // به‌جای category و categorySlug جدا
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  views: number;
  isBreaking: boolean;
  isLive?: boolean; // اگر خبر همزمان پخش زنده هم دارد
  liveUrl?: string; // لینک پخش زنده مرتبط با خبر
}

// ─── اینترفیس پخش زنده ───────────────────────────────────────────
export interface LiveStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: Category;
  startTime: string;
  isLive: boolean;
  viewers: number;
  streamUrl: string; // ★ لینک پخش (HLS/WebRTC)
  embedUrl?: string; // لینک embed برای iframe
  chatEnabled?: boolean; // آیا چت زنده فعال است؟
  status: "live" | "upcoming" | "ended";
}

// ─── اینترفیس ویدیوی آرشیوی ──────────────────────────────────────
export interface ArchivedStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: Category;
  recordedAt: string;
  duration: number; // به دقیقه
  views: number;
  videoUrl: string; // ★ لینک ویدیو (MP4/HLS)
  embedUrl?: string; // لینک embed برای iframe
  quality?: "720p" | "1080p" | "4K";
  highlights?: string[]; // تایم‌استمپ‌های مهم
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
