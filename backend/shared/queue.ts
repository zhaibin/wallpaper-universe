// 轮播队列管理（使用 KV 存储）
// 队列键按用户或设备区分：slideshow:queue:{userId|deviceId}

import type { Env } from './types';

export interface SlideshowItem {
  id: string;         // wallpaper id
  url: string;        // file url
  title?: string;
  type: 'image' | 'video';
  durationSec?: number; // 播放时长（视频可忽略）
}

export interface SlideshowQueue {
  items: SlideshowItem[];
  updatedAt: string;
}

const DEFAULT_DURATION = 60; // 每张壁纸默认 60s

export async function getQueue(env: Env, key: string): Promise<SlideshowQueue> {
  const data = await env.WALLPAPER_CACHE.get(key);
  if (!data) {
    return { items: [], updatedAt: new Date().toISOString() };
  }
  try {
    return JSON.parse(data);
  } catch {
    return { items: [], updatedAt: new Date().toISOString() };
  }
}

export async function setQueue(env: Env, key: string, queue: SlideshowQueue): Promise<void> {
  await env.WALLPAPER_CACHE.put(key, JSON.stringify(queue), { expirationTtl: 3600 * 24 }); // 24h
}

export async function addToQueue(env: Env, identifier: string, item: SlideshowItem): Promise<SlideshowQueue> {
  const key = `slideshow:queue:${identifier}`;
  const queue = await getQueue(env, key);
  // 去重（按 id）
  if (!queue.items.find(i => i.id === item.id)) {
    queue.items.push({ ...item, durationSec: item.durationSec || DEFAULT_DURATION });
  }
  queue.updatedAt = new Date().toISOString();
  await setQueue(env, key, queue);
  return queue;
}

export async function removeFromQueue(env: Env, identifier: string, wallpaperId: string): Promise<SlideshowQueue> {
  const key = `slideshow:queue:${identifier}`;
  const queue = await getQueue(env, key);
  queue.items = queue.items.filter(i => i.id !== wallpaperId);
  queue.updatedAt = new Date().toISOString();
  await setQueue(env, key, queue);
  return queue;
}

export async function clearQueue(env: Env, identifier: string): Promise<SlideshowQueue> {
  const key = `slideshow:queue:${identifier}`;
  const empty: SlideshowQueue = { items: [], updatedAt: new Date().toISOString() };
  await setQueue(env, key, empty);
  return empty;
}

export function getIdentifierFromRequest(req: Request): string {
  // 优先使用用户 Token（上层可解析），退化到设备 IP
  const ip = req.headers.get('CF-Connecting-IP') || 'anonymous';
  return ip;
}


