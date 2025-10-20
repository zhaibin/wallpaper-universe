import { kvGet, kvPut } from '../../shared/kv';
import { requireAuth } from '../../shared/auth';
import type { Env, Wallpaper, Category } from '../../shared/types';

import { 
  checkRateLimit, 
  errorResponse, 
  notFoundResponse,
  handleUpload,
  getUploadedFile,
  registerUser,
  loginUser,
  requireAuthEnhanced,
  getUserLocale,
} from '../../shared';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // CORS headers
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      // 速率限制（每个 IP 每分钟 60 次请求）
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const canProceed = await checkRateLimit(env.WALLPAPER_CACHE, clientIP, {
        limit: 60,
        window: 60,
      });

      if (!canProceed) {
        return new Response(
          JSON.stringify({ error: 'Too Many Requests' }),
          { 
            status: 429, 
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
              'Retry-After': '60',
            } 
          }
        );
      }

    // Health check
    if (url.pathname === '/health') {
      return new Response(
        JSON.stringify({ 
          ok: true, 
          timestamp: new Date().toISOString(),
          version: '0.1.0'
        }), 
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Wallpapers API
    if (url.pathname === '/v1/wallpapers') {
      return handleWallpapers(request, env, corsHeaders);
    }

    // Wallpaper detail
    if (url.pathname.match(/^\/v1\/wallpapers\/[^/]+$/)) {
      const id = url.pathname.split('/').pop();
      return handleWallpaperDetail(id!, env, corsHeaders);
    }

    // Categories
    if (url.pathname === '/v1/categories') {
      return handleCategories(corsHeaders);
    }

    // User favorites (requires auth)
    if (url.pathname === '/v1/user/favorites') {
      const authErr = requireAuth(request, env);
      if (authErr) {
        return new Response(authErr.body, { 
          status: authErr.status, 
          headers: { ...authErr.headers, ...corsHeaders } 
        });
      }
      return handleFavorites(request, env, corsHeaders);
    }

    // Upload wallpaper (requires auth)
    if (url.pathname === '/v1/upload' && request.method === 'POST') {
      const authErr = requireAuth(request, env);
      if (authErr) {
        return new Response(authErr.body, { 
          status: authErr.status, 
          headers: { ...authErr.headers, ...corsHeaders } 
        });
      }
      const response = await handleUpload(request, env);
      // 添加 CORS headers
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }

    // Get uploaded file
    if (url.pathname.startsWith('/wallpapers/')) {
      const fileName = url.pathname.replace('/wallpapers/', '');
      return getUploadedFile(fileName, env);
    }

    // User registration
    if (url.pathname === '/v1/auth/register' && request.method === 'POST') {
      const body = await request.json() as any;
      const locale = getUserLocale(request);
      const result = await registerUser(
        env,
        body.username,
        body.email,
        body.password,
        body.locale || locale
      );
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // User login
    if (url.pathname === '/v1/auth/login' && request.method === 'POST') {
      const body = await request.json() as any;
      const result = await loginUser(env, body.usernameOrEmail, body.password);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get current user profile
    if (url.pathname === '/v1/user/profile') {
      const { user, error } = await requireAuthEnhanced(request, env);
      if (error) return error;
      
      const { passwordHash, ...userProfile } = user as any;
      return new Response(JSON.stringify(userProfile), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return notFoundResponse();
    } catch (error) {
      return errorResponse(error);
    }
  }
};

async function handleWallpapers(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'all';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');

  // Try cache first
  const cacheKey = `wallpapers:${category}:${page}:${limit}`;
  const cached = await kvGet(env.WALLPAPER_CACHE, cacheKey);
  if (cached) {
    return new Response(cached, { 
      headers: { 
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
        ...corsHeaders 
      } 
    });
  }

  // Mock data (replace with actual database query)
  const mockWallpapers = [
    {
      id: '1',
      title: '自然风光 1',
      url: 'https://picsum.photos/1920/1080',
      thumbnail: 'https://picsum.photos/400/300',
      category: 'nature',
      width: 1920,
      height: 1080,
      author: 'John Doe',
      tags: ['nature', 'landscape'],
    },
    {
      id: '2',
      title: '抽象艺术',
      url: 'https://picsum.photos/1920/1080?random=2',
      thumbnail: 'https://picsum.photos/400/300?random=2',
      category: 'abstract',
      width: 1920,
      height: 1080,
      author: 'Jane Smith',
      tags: ['abstract', 'art'],
    },
    {
      id: '3',
      title: '简约设计',
      url: 'https://picsum.photos/1920/1080?random=3',
      thumbnail: 'https://picsum.photos/400/300?random=3',
      category: 'minimal',
      width: 1920,
      height: 1080,
      author: 'Mike Johnson',
      tags: ['minimal', 'design'],
    },
  ];

  const filteredWallpapers = category === 'all' 
    ? mockWallpapers 
    : mockWallpapers.filter(w => w.category === category);

  const body = JSON.stringify(filteredWallpapers);
  
  // Cache for 60 seconds
  await kvPut(env.WALLPAPER_CACHE, cacheKey, body, 60);

  return new Response(body, { 
    headers: { 
      'Content-Type': 'application/json',
      'X-Cache': 'MISS',
      ...corsHeaders 
    } 
  });
}

async function handleWallpaperDetail(id: string, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  // Mock data
  const wallpaper = {
    id,
    title: '壁纸详情',
    url: `https://picsum.photos/1920/1080?random=${id}`,
    thumbnail: `https://picsum.photos/400/300?random=${id}`,
    category: 'nature',
    width: 1920,
    height: 1080,
    author: 'John Doe',
    tags: ['nature', 'landscape'],
    downloads: 1234,
    views: 5678,
  };

  return new Response(JSON.stringify(wallpaper), {
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders 
    }
  });
}

async function handleCategories(corsHeaders: Record<string, string>): Promise<Response> {
  const categories = [
    { id: 'all', name: '全部', count: 1000 },
    { id: 'nature', name: '自然', count: 250 },
    { id: 'abstract', name: '抽象', count: 180 },
    { id: 'minimal', name: '简约', count: 150 },
    { id: 'dark', name: '暗色', count: 200 },
    { id: 'colorful', name: '彩色', count: 220 },
  ];

  return new Response(JSON.stringify(categories), {
    headers: { 
      'Content-Type': 'application/json',
      ...corsHeaders 
    }
  });
}

async function handleFavorites(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  if (request.method === 'GET') {
    // Return user favorites (mock data)
    return new Response(JSON.stringify({ favorites: [] }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      }
    });
  }

  if (request.method === 'POST') {
    // Add to favorites
    const body = await request.json();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      }
    });
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }), 
    { 
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      }
    }
  );
}
