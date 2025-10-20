// 文件上传处理

import type { Env, Wallpaper, UploadResponse } from './types';
import { analyzeImage } from './ai-analysis';
import { generateSecureToken } from './security';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export async function handleUpload(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    
    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: '未提供文件' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: '文件大小不能超过 50MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 验证文件类型
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    
    if (!isImage && !isVideo) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '不支持的文件类型。请上传图片（JPEG, PNG, WebP, GIF）或视频（MP4, WebM）',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 生成唯一ID
    const wallpaperId = generateSecureToken(16);
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${wallpaperId}.${fileExt}`;
    const thumbnailName = `${wallpaperId}_thumb.jpg`;

    // 上传到 R2
    const fileBuffer = await file.arrayBuffer();
    await env.WALLPAPERS.put(fileName, fileBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    // 如果是图片，进行 AI 分析
    let aiAnalysis;
    if (isImage) {
      aiAnalysis = await analyzeImage(env.AI, fileBuffer);
      
      // 生成缩略图（简化版，实际应该用图片处理库）
      // 这里假设缩略图已生成
      await env.WALLPAPERS.put(thumbnailName, fileBuffer, {
        httpMetadata: {
          contentType: 'image/jpeg',
        },
      });
    }

    // 构建壁纸对象
    const wallpaper: Wallpaper = {
      id: wallpaperId,
      title: title || aiAnalysis?.description.substring(0, 30) || '未命名壁纸',
      description: aiAnalysis?.description,
      url: `/wallpapers/${fileName}`,
      thumbnail: isImage ? `/wallpapers/${thumbnailName}` : undefined,
      type: isImage ? 'image' : 'video',
      size: file.size,
      category: category || 'uncategorized',
      tags: aiAnalysis?.tags,
      colors: aiAnalysis?.colors,
      aiAnalysis,
      createdAt: new Date().toISOString(),
    };

    // 存储到 KV（用于快速查询）
    await env.WALLPAPER_CACHE.put(
      `wallpaper:${wallpaperId}`,
      JSON.stringify(wallpaper),
      { expirationTtl: 86400 * 30 } // 30天
    );

    // 更新壁纸列表缓存
    await invalidateWallpaperCache(env);

    const response: UploadResponse = {
      success: true,
      wallpaper,
      uploadId: wallpaperId,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload failed:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : '上传失败',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function invalidateWallpaperCache(env: Env) {
  // 清除壁纸列表缓存
  const cacheKeys = ['wallpapers:latest', 'wallpapers:all'];
  await Promise.all(
    cacheKeys.map(key => env.WALLPAPER_CACHE.delete(key))
  );
}

// 获取上传的文件
export async function getUploadedFile(
  fileName: string,
  env: Env
): Promise<Response> {
  try {
    const object = await env.WALLPAPERS.get(fileName);
    
    if (!object) {
      return new Response('File not found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=31536000, immutable');

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Failed to get file:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

