// AnyWallpaper 核心类型定义和工具函数

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

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// 常用工具函数
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.anywallpaper.com/v1';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN');
}

export function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}
