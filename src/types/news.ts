// types/news.ts
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  categorySlug: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  views: number;
  isBreaking: boolean;
}

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  categorySlug: string;
  startTime: string;
  isLive: boolean;
  viewers: number;
  streamUrl?: string;
}

export interface ArchivedStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  categorySlug: string;
  recordedAt: string;
  duration: number; // به دقیقه
  views: number;
  videoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
}
