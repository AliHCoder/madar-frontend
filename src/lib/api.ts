// lib/api.ts
import axios from "axios";
import {
  Article,
  LiveStream,
  ArchivedStream,
  Category,
  ApiResponse,
} from "@/types/news";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getFullImageUrl = (url?: string) => {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  const base = API_URL || "http://localhost:3001";
  return `${base}${url}`;
};

const normalizeId = (item: any) => ({
  ...item,
  id: item._id || item.id,
  image: getFullImageUrl(item.image),
  thumbnail: getFullImageUrl(item.thumbnail),
  videoUrl: getFullImageUrl(item.videoUrl),
  streamUrl: getFullImageUrl(item.streamUrl),
});

const normalizeArray = (arr: any[]) => arr.map(normalizeId);

// ─── News API ──────────────────────────────────────────────
export const newsApi = {
  getLatest: async (page = 1, limit = 10): Promise<ApiResponse<Article[]>> => {
    const { data } = await api.get(`/articles?page=${page}&limit=${limit}`);
    if (data.data) data.data = normalizeArray(data.data);
    return data;
  },

  getTrending: async (limit = 10): Promise<ApiResponse<Article[]>> => {
    const { data } = await api.get(`/articles?limit=${limit}&sort=-views`);
    if (data.data) data.data = normalizeArray(data.data);
    return {
      ...data,
      data: data.data.sort((a: Article, b: Article) => b.views - a.views),
    };
  },

  getById: async (id: string): Promise<Article> => {
    const { data } = await api.get(`/articles/${id}`);
    return normalizeId(data);
  },

  getByCategory: async (
    slug: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<Article[]>> => {
    const { data } = await api.get(
      `/articles?category=${slug}&page=${page}&limit=${limit}`,
    );
    if (data.data) data.data = normalizeArray(data.data);
    return data;
  },

  search: async (query: string): Promise<Article[]> => {
    const { data } = await api.get(
      `/articles?search=${encodeURIComponent(query)}`,
    );
    return normalizeArray(data.data || []);
  },

  getBreaking: async (): Promise<Article[]> => {
    const { data } = await api.get("/articles/breaking");
    const list = Array.isArray(data) ? data : data.data || [];
    return normalizeArray(list);
  },

  getFeatured: async (): Promise<Article[]> => {
    const { data } = await api.get("/articles?limit=5&sort=-views");
    return normalizeArray(data.data || []);
  },

  getRelated: async (id: string, categorySlug: string): Promise<Article[]> => {
    const { data } = await api.get(
      `/articles?category=${categorySlug}&limit=4`,
    );
    return normalizeArray(data.data || [])
      .filter((a: Article) => a.id !== id)
      .slice(0, 4);
  },

  create: async (formData: FormData): Promise<Article> => {
    const { data } = await api.post("/articles", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeId(data);
  },

  update: async (id: string, formData: FormData): Promise<Article> => {
    const { data } = await api.put(`/articles/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeId(data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },
};

// ─── Live API ──────────────────────────────────────────────
export const liveApi = {
  getActive: async (): Promise<LiveStream[]> => {
    const { data } = await api.get("/live/active");
    const list = Array.isArray(data) ? data : data.data || [];
    return normalizeArray(list);
  },

  getAll: async (page = 1, limit = 10): Promise<ApiResponse<LiveStream[]>> => {
    const { data } = await api.get(`/live?page=${page}&limit=${limit}`);
    if (data.data) data.data = normalizeArray(data.data);
    return data;
  },

  getById: async (id: string): Promise<LiveStream> => {
    const { data } = await api.get(`/live/${id}`);
    return normalizeId(data);
  },

  getByCategory: async (
    slug: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<LiveStream[]>> => {
    const { data } = await api.get(
      `/live?category=${slug}&page=${page}&limit=${limit}`,
    );
    if (data.data) data.data = normalizeArray(data.data);
    return data;
  },

  getUpcoming: async (): Promise<LiveStream[]> => {
    const { data } = await api.get("/live?status=upcoming");
    return normalizeArray(data.data || []);
  },

  create: async (formData: FormData): Promise<LiveStream> => {
    const { data } = await api.post("/live", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeId(data);
  },

  update: async (id: string, formData: FormData): Promise<LiveStream> => {
    const { data } = await api.put(`/live/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeId(data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/live/${id}`);
  },
};

// ─── Archive API ───────────────────────────────────────────
export const archiveApi = {
  getAll: async (
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<ArchivedStream[]>> => {
    const { data } = await api.get(`/archive?page=${page}&limit=${limit}`);
    if (data.data) data.data = normalizeArray(data.data);
    return data;
  },

  getById: async (id: string): Promise<ArchivedStream> => {
    const { data } = await api.get(`/archive/${id}`);
    return normalizeId(data);
  },

  getByCategory: async (
    slug: string,
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<ArchivedStream[]>> => {
    const { data } = await api.get(
      `/archive?category=${slug}&page=${page}&limit=${limit}`,
    );
    if (data.data) data.data = normalizeArray(data.data);
    return data;
  },

  getRecent: async (limit = 6): Promise<ArchivedStream[]> => {
    const { data } = await api.get(`/archive?limit=${limit}&sort=-recordedAt`);
    return normalizeArray(data.data || []);
  },

  getPopular: async (limit = 6): Promise<ArchivedStream[]> => {
    const { data } = await api.get(`/archive?limit=${limit}&sort=-views`);
    return normalizeArray(data.data || []);
  },

  create: async (formData: FormData): Promise<ArchivedStream> => {
    const { data } = await api.post("/archive", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeId(data);
  },

  update: async (id: string, formData: FormData): Promise<ArchivedStream> => {
    const { data } = await api.put(`/archive/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeId(data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/archive/${id}`);
  },
};

// ─── Categories API ────────────────────────────────────────
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get("/categories");
    const list = Array.isArray(data) ? data : data.data || [];
    return normalizeArray(list);
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const { data } = await api.get(`/categories/${slug}`);
    return normalizeId(data);
  },
};

// ─── Auth API ──────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  register: async (username: string, email: string, password: string) => {
    const { data } = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data.user;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  isAuthenticated: () => {
    if (typeof window !== "undefined") return !!localStorage.getItem("token");
    return false;
  },
};

export default api;
