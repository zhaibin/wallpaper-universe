// 安全相关工具函数

// 内容安全策略 Headers
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Content Security Policy
    'Content-Security-Policy': 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.anywallpaper.net;",
    
    // 防止点击劫持
    'X-Frame-Options': 'DENY',
    
    // XSS 保护
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    
    // HTTPS 强制
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}

// 验证输入
export function validateInput(input: string, maxLength = 1000): boolean {
  if (!input || typeof input !== 'string') return false;
  if (input.length > maxLength) return false;
  // 检查是否包含恶意脚本
  const dangerousPatterns = /<script|javascript:|onerror=|onload=/i;
  return !dangerousPatterns.test(input);
}

// 生成安全的随机字符串
export function generateSecureToken(length = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// SQL 注入防护（用于 D1）
export function sanitizeForSQL(input: string): string {
  return input.replace(/'/g, "''");
}

