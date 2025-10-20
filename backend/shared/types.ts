// 共享类型定义

export interface Env {
  WALLPAPER_CACHE: KVNamespace;
  WALLPAPERS: R2Bucket;
  AI: any; // Workers AI binding
  DB?: D1Database;
  JWT_SECRET?: string;
}

export interface Wallpaper {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  type: 'image' | 'video'; // 新增类型字段
  category?: string;
  width?: number;
  height?: number;
  size?: number; // 文件大小（bytes）
  duration?: number; // 视频时长（秒）
  author?: string;
  authorId?: string;
  tags?: WallpaperTag[]; // 改为结构化标签
  colors?: ColorInfo[]; // 主要颜色
  downloads?: number;
  views?: number;
  likes?: number;
  aiAnalysis?: AIAnalysisResult; // AI 分析结果
  createdAt?: string;
  updatedAt?: string;
}

export interface WallpaperTag {
  level: 1 | 2 | 3; // 标签层级
  name: string;
  weight: number; // 权重 0-1
}

export interface ColorInfo {
  hex: string; // 颜色十六进制值
  rgb: [number, number, number];
  percentage: number; // 占比
  name?: string; // 颜色名称（如：深蓝色）
}

export interface AIAnalysisResult {
  description: string; // 50字描述
  tags: WallpaperTag[]; // 三级标签
  colors: ColorInfo[]; // 主要颜色
  detectedObjects?: string[]; // 检测到的物体
  mood?: string; // 情绪/氛围
  style?: string; // 风格
  analyzedAt: string;
}

export interface UploadRequest {
  file: File | Blob;
  title?: string;
  category?: string;
}

export interface UploadResponse {
  success: boolean;
  wallpaper?: Wallpaper;
  error?: string;
  uploadId?: string;
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
