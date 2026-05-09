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
    if (retries === 0) {
      console.error("Max retries reached:", error);
      throw error;
    }
    console.warn(`Retry attempt ${3 - retries}, waiting ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return axiosRetry(fn, retries - 1, delay * 2);
  }
};

// ★ اینترسپتور درخواست با لاگ بهتر
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `📡 Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// ★ اینترسپتور پاسخ با مدیریت خطا
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ Response: ${response.config.url} - Status: ${response.status}`,
    );
    return response;
  },
  (error: AxiosError) => {
    // لاگ دقیق‌تر خطا
    const errorDetails = {
      url: error.config?.url || "unknown",
      method: error.config?.method?.toUpperCase() || "unknown",
      status: error.response?.status || "no status",
      statusText: error.response?.statusText || "no status text",
      message: error.message,
      data: error.response?.data || "no data",
    };

    console.error("❌ API Error:", errorDetails);
    return Promise.reject(error);
  },
);

const getFullImageUrl = (url?: string) => {
  if (!url) return "/assets/images/png/test.jpg";
  if (url.startsWith("http")) return url;
  const base = API_URL.replace("/api", "");
  return `${base}${url}`;
};

const normalizeId = (item: any) => {
  return {
    ...item,
    id: item._id || item.id,
    image: getFullImageUrl(item.image),
    thumbnail: getFullImageUrl(item.thumbnail),
    videoUrl: getFullImageUrl(item.videoUrl),
    streamUrl: getFullImageUrl(item.streamUrl), // ← مشکل اینجاست
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

  search: async (query: string): Promise<Article[]> => {
    return axiosRetry(async () => {
      const { data } = await api.get(
        `/articles/search?q=${encodeURIComponent(query)}`,
      );
      const list = Array.isArray(data) ? data : data.data || [];
      return normalizeArray(list);
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

  getById: async (id: string): Promise<ArchivedStream> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/archive/${id}`);
      return normalizeId(data);
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

  getBySlug: async (slug: string): Promise<Category> => {
    return axiosRetry(async () => {
      const { data } = await api.get(`/categories/${slug}`);
      return normalizeId(data);
    });
  },
};

export default api;
