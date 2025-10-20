// 共享类型定义

export interface Env {
  WALLPAPER_CACHE: KVNamespace;
  DB?: D1Database;
  JWT_SECRET?: string;
}

export interface Wallpaper {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  category?: string;
  width?: number;
  height?: number;
  author?: string;
  tags?: string[];
  downloads?: number;
  views?: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  count?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface CacheOptions {
  ttl?: number;
  key: string;
}

