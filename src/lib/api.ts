// lib/api.ts
import axios, { AxiosError } from "axios";
import {
  Article,
  LiveStream,
  ArchivedStream,
  Category,
  ApiResponse,
} from "@/types/news";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.madaar.tv/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ★ بهبود axiosRetry با مدیریت بهتر خطا
const axiosRetry = async <T>(
  fn: () => Promise<T>,
  retries = 2, // کاهش تعداد تلاش‌ها
  delay = 1000,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return axiosRetry(fn, retries - 1, delay * 2);
  }
};

api.interceptors.request.use(
  (config) => {
    if (config.method === "get" || config.method === "GET") {
      config.params = { ...config.params, _t: Date.now() };
    }
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error),
);

const BACKEND_URL = API_URL.replace(/\/api$/, "");

const getFullImageUrl = (url?: string | null) => {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "/assets/images/png/test.jpg";
  }
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
};

const normalizeTags = (tags: any): string[] => {
  if (!tags) return [];

  const parseDeep = (val: any): any => {
    if (typeof val === "string" && /^[[{]/.test(val)) {
      try { return parseDeep(JSON.parse(val)); } catch {}
    }
    return val;
  };
  const cleaned = parseDeep(tags);

  if (Array.isArray(cleaned)) {
    if (cleaned.some((t: any) => typeof t === "string" && /[[\]]/.test(t))) {
      try {
        const joined = cleaned.join(",");
        const parsed = JSON.parse(joined);
        if (Array.isArray(parsed)) return normalizeTags(parsed);
      } catch {}
    }
    return cleaned.map((t: any) => String(t).replace(/^["\s]+|["\s]+$/g, ""));
  }

  if (typeof cleaned === "string") {
    return cleaned.split(",").map((t: string) => t.trim().replace(/^["\s]+|["\s]+$/g, "")).filter(Boolean);
  }

  return [];
};

const normalizeHighlights = (highlights: any): string[] => {
  if (!highlights) return [];
  if (Array.isArray(highlights)) {
    return highlights.map((h: any) => {
      if (typeof h === "string" && (h.startsWith("[") || h.startsWith('"'))) {
        try { return JSON.parse(h); } catch {}
      }
      return h;
    }).flat().filter(Boolean);
  }
  if (typeof highlights === "string") {
    if (highlights.startsWith("[")) {
      try { return normalizeHighlights(JSON.parse(highlights)); } catch {}
    }
    return [highlights];
  }
  return [];
};

const normalizeId = (item: any) => {
  if (!item || typeof item !== "object") return item;
  return {
    ...item,
    id: item._id || item.id,
    tags: normalizeTags(item.tags),
    image: getFullImageUrl(item.image),
    thumbnail: getFullImageUrl(item.thumbnail),
    videoUrl: getFullImageUrl(item.videoUrl),
    streamUrl: getFullImageUrl(item.streamUrl),
    highlights: normalizeHighlights(item.highlights),
  };
};

const normalizeArray = (arr: any[]) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeId);
};

export const newsApi = {
  getLatest: async (page = 1, limit = 10): Promise<ApiResponse<Article[]>> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/articles?page=${page}&limit=${limit}`);
      if (data.data) data.data = normalizeArray(data.data);
      return data;
    });
  },

  getBreaking: async (): Promise<Article[]> => {
    return axiosRetry(async () => {
      const { data } = await api.get("/articles/breaking");
      const list = Array.isArray(data) ? data : data.data || [];
      return normalizeArray(list);
    });
  },

  getById: async (id: string): Promise<Article> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/articles/${id}`);
      return normalizeId(data);
    });
  },

  getByCategory: async (
    slug: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<Article[]>> => {
    return axiosRetry(async () => {
      const { data } = await api.get(
        `/articles?category=${slug}&page=${page}&limit=${limit}`,
      );
      if (data.data) data.data = normalizeArray(data.data);
      return data;
    });
  },

  search: async (query: string, page = 1, limit = 10): Promise<ApiResponse<Article[]>> => {
    return axiosRetry(async () => {
      const { data } = await api.get(
        `/articles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );
      if (data.data) data.data = normalizeArray(data.data);
      return data;
    });
  },

  getByTags: async (tags: string[], page = 1, limit = 10): Promise<ApiResponse<Article[]>> => {
    return axiosRetry(async () => {
      const { data } = await api.get(
        `/articles?tags=${tags.join(",")}&page=${page}&limit=${limit}`,
      );
      if (data.data) data.data = normalizeArray(data.data);
      return data;
    });
  },
};

export const liveApi = {
  getActive: async (): Promise<LiveStream[]> => {
    return axiosRetry(async () => {
      const { data } = await api.get("/live/active");
      const list = Array.isArray(data) ? data : data.data || [];
      return normalizeArray(list);
    });
  },

  getAll: async (page = 1, limit = 10): Promise<ApiResponse<LiveStream[]>> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/live?page=${page}&limit=${limit}`);
      if (data.data) data.data = normalizeArray(data.data);
      return data;
    });
  },

  getById: async (id: string): Promise<LiveStream> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/live/${id}`);
      return normalizeId(data);
    });
  },
};

export const archiveApi = {
  getAll: async (
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<ArchivedStream[]>> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/archive?page=${page}&limit=${limit}`);
      if (data.data) data.data = normalizeArray(data.data);
      return data;
    });
  },

  getRecent: async (limit = 6): Promise<ArchivedStream[]> => {
    return axiosRetry(async () => {
      const { data } = await api.get(
        `/archive?limit=${limit}&sort=-recordedAt`,
      );
      return normalizeArray(data.data || []);
    });
  },

  getByCategory: async (slug: string, page = 1, limit = 10): Promise<ApiResponse<ArchivedStream[]>> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/archive?category=${slug}&page=${page}&limit=${limit}`);
      if (data.data) data.data = normalizeArray(data.data);
      return data;
    });
  },

  getById: async (id: string): Promise<ArchivedStream> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/archive/${id}`);
      return normalizeId(data);
    });
  },

  search: async (query: string, page = 1, limit = 10): Promise<ApiResponse<ArchivedStream[]>> => {
    return axiosRetry(async () => {
      const { data } = await api.get(
        `/archive/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );
      if (data.data) data.data = normalizeArray(data.data);
      return data;
    });
  },
};

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    return axiosRetry(async () => {
      const { data } = await api.get("/categories");
      const list = Array.isArray(data) ? data : data.data || [];
      return normalizeArray(list);
    });
  },

  getHomepage: async (): Promise<Category[]> => {
    return axiosRetry(async () => {
      const { data } = await api.get("/categories/homepage");
      const list = Array.isArray(data) ? data : data.data || [];
      return normalizeArray(list);
    });
  },

  getBySlug: async (slug: string): Promise<Category> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/categories/${slug}`);
      return normalizeId(data);
    });
  },
};

export interface Comment {
  _id: string;
  id: string;
  article: string;
  name: string;
  email?: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
}

export const commentApi = {
  getByArticle: async (articleId: string): Promise<Comment[]> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/comments/article/${articleId}`);
      return (Array.isArray(data) ? data : data.data || []).map((c: any) => ({
        ...c,
        id: c._id || c.id,
      }));
    });
  },
  create: async (article: string, name: string, body: string, email?: string): Promise<Comment> => {
    const { data } = await api.post("/comments", { article, name, body, email });
    return { ...data, id: data._id || data.id };
  },
};

export const ratingApi = {
  submit: async (targetType: "live" | "archive" | "article", targetId: string, score: number) => {
    return axiosRetry(async () => {
      const { data } = await api.post("/ratings", { targetType, targetId, score });
      return data;
    });
  },
  getRating: async (targetType: "live" | "archive" | "article", targetId: string) => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/ratings/${targetType}/${targetId}`);
      return data;
    });
  },
};

export interface TagItem {
  _id: string;
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const tagApi = {
  getAll: async (page = 1, limit = 50): Promise<ApiResponse<TagItem[]>> => {
    const { data } = await api.get(`/tags?page=${page}&limit=${limit}`);
    if (data.data) data.data = data.data.map((t: any) => ({ ...t, id: t._id || t.id }));
    return data;
  },
  getBySlug: async (slug: string): Promise<TagItem> => {
    const { data } = await api.get(`/tags/${slug}`);
    return { ...data, id: data._id || data.id };
  },
  getArticles: async (slug: string, page = 1, limit = 10): Promise<ApiResponse<Article[]>> => {
    const { data } = await api.get(`/tags/${slug}/articles?page=${page}&limit=${limit}`);
    if (data.data) data.data = normalizeArray(data.data);
    return data;
  },
};

export interface HeroItem {
  type: "article" | "archive";
  data: Article | ArchivedStream;
}

export const heroApi = {
  getSettings: async (): Promise<{ isActive: boolean; items: HeroItem[] }> => {
    const { data } = await api.get("/hero");
    if (data.items) {
      data.items = data.items.map((item: any) => ({
        ...item,
        data: normalizeId(item.data),
      }));
    }
    return data;
  },
};

export interface SocialLink {
  _id?: string;
  id: string;
  name: string;
  url: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export const socialApi = {
  getActive: async (): Promise<SocialLink[]> => {
    const { data } = await api.get("/social/active");
    return (Array.isArray(data) ? data : []).map((s: any) => ({ ...s, id: s._id || s.id }));
  },
};

export default api;
