// 完整的用户认证系统

import type { Env } from './types';
import { generateSecureToken } from './security';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  locale?: string; // 用户偏好语言
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'passwordHash'>;
  error?: string;
}

// 注册用户
export async function registerUser(
  env: Env,
  username: string,
  email: string,
  password: string,
  locale: string = 'en'
): Promise<AuthResponse> {
  try {
    // 验证输入
    if (!username || username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }
    if (!email || !isValidEmail(email)) {
      return { success: false, error: 'Invalid email address' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // 检查用户是否已存在
    const existingUser = await env.DB?.prepare(
      'SELECT id FROM users WHERE username = ? OR email = ?'
    ).bind(username, email).first();

    if (existingUser) {
      return { success: false, error: 'Username or email already exists' };
    }

    // 生成用户 ID 和密码哈希
    const userId = generateSecureToken(16);
    const passwordHash = await hashPassword(password);

    // 插入用户
    await env.DB?.prepare(
      `INSERT INTO users (id, username, email, password_hash, locale, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    ).bind(userId, username, email, passwordHash, locale).run();

    // 生成 JWT token
    const token = await generateJWT(userId, username, env);

    return {
      success: true,
      token,
      user: {
        id: userId,
        username,
        email,
        locale,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

// 用户登录
export async function loginUser(
  env: Env,
  usernameOrEmail: string,
  password: string
): Promise<AuthResponse> {
  try {
    // 查找用户
    const user = await env.DB?.prepare(
      `SELECT * FROM users WHERE username = ? OR email = ?`
    ).bind(usernameOrEmail, usernameOrEmail).first() as User | null;

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // 生成 token
    const token = await generateJWT(user.id, user.username, env);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      success: true,
      token,
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// 验证 JWT Token
export async function verifyJWT(token: string, env: Env): Promise<User | null> {
  try {
    // 简化版 JWT 验证
    // 生产环境应使用真实的 JWT 库
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    
    // 检查过期时间
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }

    // 从数据库获取用户
    const user = await env.DB?.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(payload.userId).first() as User | null;

    return user;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// 生成 JWT
async function generateJWT(
  userId: string,
  username: string,
  env: Env
): Promise<string> {
  // 简化版 JWT 生成
  // 生产环境应使用真实的 JWT 库和签名
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 天过期
  }));
  const signature = await sign(`${header}.${payload}`, env.JWT_SECRET || 'secret');
  
  return `${header}.${payload}.${signature}`;
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// 密码哈希
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// 验证密码
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// 验证邮箱格式
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 增强的认证中间件
export async function requireAuthEnhanced(
  request: Request,
  env: Env
): Promise<{ user: User | null; error: Response | null }> {
  const auth = request.headers.get('Authorization') || '';
  
  if (!auth.startsWith('Bearer ')) {
    return {
      user: null,
      error: new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  const token = auth.slice(7);
  const user = await verifyJWT(token, env);

  if (!user) {
    return {
      user: null,
      error: new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  return { user, error: null };
}

