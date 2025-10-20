-- AnyWallpaper 数据库 Schema
-- 用于 Cloudflare D1

-- 壁纸表
CREATE TABLE IF NOT EXISTS wallpapers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail TEXT,
  type TEXT NOT NULL CHECK(type IN ('image', 'video')), -- 图片或视频
  category TEXT,
  width INTEGER,
  height INTEGER,
  size INTEGER, -- 文件大小（bytes）
  duration INTEGER, -- 视频时长（秒）
  author TEXT,
  author_id TEXT,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  ai_description TEXT, -- AI 生成的描述
  ai_mood TEXT, -- 情绪/氛围
  ai_style TEXT, -- 风格
  analyzed_at DATETIME, -- AI 分析时间
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 标签表（三级标签系统）
CREATE TABLE IF NOT EXISTS wallpaper_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallpaper_id TEXT NOT NULL,
  tag_level INTEGER NOT NULL CHECK(tag_level IN (1, 2, 3)), -- 标签层级
  tag_name TEXT NOT NULL,
  weight REAL NOT NULL CHECK(weight >= 0 AND weight <= 1), -- 权重 0-1
  FOREIGN KEY (wallpaper_id) REFERENCES wallpapers(id) ON DELETE CASCADE
);

-- 颜色表
CREATE TABLE IF NOT EXISTS wallpaper_colors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallpaper_id TEXT NOT NULL,
  hex_color TEXT NOT NULL, -- 十六进制颜色值
  rgb_r INTEGER NOT NULL CHECK(rgb_r >= 0 AND rgb_r <= 255),
  rgb_g INTEGER NOT NULL CHECK(rgb_g >= 0 AND rgb_g <= 255),
  rgb_b INTEGER NOT NULL CHECK(rgb_b >= 0 AND rgb_b <= 255),
  percentage INTEGER NOT NULL, -- 占比
  color_name TEXT, -- 颜色名称
  FOREIGN KEY (wallpaper_id) REFERENCES wallpapers(id) ON DELETE CASCADE
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en' CHECK(locale IN ('en', 'zh', 'es', 'fr', 'pt', 'ja')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id TEXT NOT NULL,
  wallpaper_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, wallpaper_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (wallpaper_id) REFERENCES wallpapers(id) ON DELETE CASCADE
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 下载记录表（用于统计）
CREATE TABLE IF NOT EXISTS download_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallpaper_id TEXT NOT NULL,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallpaper_id) REFERENCES wallpapers(id)
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_wallpapers_category ON wallpapers(category);
CREATE INDEX IF NOT EXISTS idx_wallpapers_type ON wallpapers(type);
CREATE INDEX IF NOT EXISTS idx_wallpapers_created_at ON wallpapers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallpapers_downloads ON wallpapers(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_wallpapers_likes ON wallpapers(likes DESC);

CREATE INDEX IF NOT EXISTS idx_tags_wallpaper_id ON wallpaper_tags(wallpaper_id);
CREATE INDEX IF NOT EXISTS idx_tags_level ON wallpaper_tags(tag_level);
CREATE INDEX IF NOT EXISTS idx_tags_name ON wallpaper_tags(tag_name);
CREATE INDEX IF NOT EXISTS idx_tags_weight ON wallpaper_tags(weight DESC);

CREATE INDEX IF NOT EXISTS idx_colors_wallpaper_id ON wallpaper_colors(wallpaper_id);
CREATE INDEX IF NOT EXISTS idx_colors_hex ON wallpaper_colors(hex_color);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_wallpaper_id ON user_favorites(wallpaper_id);

-- 插入默认分类
INSERT OR IGNORE INTO categories (id, name, description, sort_order) VALUES
  ('all', '全部', '所有壁纸', 0),
  ('nature', '自然', '自然风光和户外场景', 1),
  ('abstract', '抽象', '抽象艺术和图案', 2),
  ('minimal', '简约', '简约设计和纯色', 3),
  ('dark', '暗色', '暗色调壁纸', 4),
  ('colorful', '彩色', '多彩鲜艳壁纸', 5),
  ('urban', '城市', '城市建筑和街景', 6),
  ('space', '太空', '宇宙和星空', 7),
  ('anime', '动漫', '动漫插画', 8),
  ('animals', '动物', '动物和宠物', 9);

