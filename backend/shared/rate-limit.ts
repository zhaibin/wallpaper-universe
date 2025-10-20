// 简单的速率限制实现

export interface RateLimitConfig {
  limit: number; // 请求数量限制
  window: number; // 时间窗口（秒）
}

export async function checkRateLimit(
  kv: KVNamespace | undefined,
  identifier: string,
  config: RateLimitConfig
): Promise<boolean> {
  if (!kv) return true; // 如果没有 KV，跳过限制

  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  
  // 获取当前计数
  const dataStr = await kv.get(key);
  const data = dataStr ? JSON.parse(dataStr) : null;

  if (!data || now - data.timestamp > config.window * 1000) {
    // 重置计数
    await kv.put(
      key,
      JSON.stringify({ count: 1, timestamp: now }),
      { expirationTtl: config.window }
    );
    return true;
  }

  if (data.count >= config.limit) {
    return false; // 超过限制
  }

  // 增加计数
  await kv.put(
    key,
    JSON.stringify({ count: data.count + 1, timestamp: data.timestamp }),
    { expirationTtl: config.window }
  );
  return true;
}

export function rateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
  };
}

