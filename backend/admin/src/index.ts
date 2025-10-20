import { requireAuth } from '../../shared/auth';

export interface Env {
  WALLPAPER_CACHE: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // All admin routes require authentication
    const authErr = requireAuth(request, env);
    if (authErr) return authErr;

    // Dashboard
    if (url.pathname === '/' || url.pathname === '/dashboard') {
      return handleDashboard();
    }

    // Wallpapers management
    if (url.pathname === '/wallpapers') {
      return handleWallpapersManagement(request);
    }

    // Upload wallpaper
    if (url.pathname === '/upload') {
      return handleUpload(request);
    }

    // Statistics
    if (url.pathname === '/stats') {
      return handleStats();
    }

    return new Response('Admin: Not found', { status: 404 });
  }
};

function handleDashboard(): Response {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AnyWallpaper Admin Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { 
      font-size: 2rem; 
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .card h2 { 
      font-size: 1.1rem; 
      color: #666;
      margin-bottom: 0.5rem;
    }
    .card .value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }
    nav {
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    nav a {
      display: inline-block;
      margin-right: 1.5rem;
      padding: 0.5rem 1rem;
      color: #667eea;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.2s;
    }
    nav a:hover {
      background: #f0f0f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>AnyWallpaper 管理后台</h1>
    
    <div class="grid">
      <div class="card">
        <h2>总壁纸数</h2>
        <div class="value">1,234</div>
      </div>
      <div class="card">
        <h2>总下载量</h2>
        <div class="value">45,678</div>
      </div>
      <div class="card">
        <h2>活跃用户</h2>
        <div class="value">2,345</div>
      </div>
      <div class="card">
        <h2>今日访问</h2>
        <div class="value">567</div>
      </div>
    </div>

    <nav>
      <a href="/dashboard">仪表盘</a>
      <a href="/wallpapers">壁纸管理</a>
      <a href="/upload">上传壁纸</a>
      <a href="/stats">统计数据</a>
    </nav>
  </div>
</body>
</html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

async function handleWallpapersManagement(request: Request): Promise<Response> {
  if (request.method === 'GET') {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>壁纸管理 - AnyWallpaper Admin</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { margin-bottom: 2rem; }
    table { 
      width: 100%; 
      background: white; 
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    th, td { padding: 1rem; text-align: left; }
    th { background: #667eea; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 0.5rem;
    }
    .btn-edit { background: #667eea; color: white; }
    .btn-delete { background: #f44336; color: white; }
  </style>
</head>
<body>
  <div class="container">
    <h1>壁纸管理</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>标题</th>
          <th>分类</th>
          <th>下载量</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>自然风光</td>
          <td>nature</td>
          <td>1,234</td>
          <td>
            <button class="btn-edit">编辑</button>
            <button class="btn-delete">删除</button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>抽象艺术</td>
          <td>abstract</td>
          <td>987</td>
          <td>
            <button class="btn-edit">编辑</button>
            <button class="btn-delete">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <br>
    <a href="/dashboard">← 返回仪表盘</a>
  </div>
</body>
</html>
    `;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleUpload(request: Request): Promise<Response> {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>上传壁纸 - AnyWallpaper Admin</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 600px; margin: 0 auto; }
    h1 { margin-bottom: 2rem; }
    form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>上传壁纸</h1>
    <form>
      <div class="form-group">
        <label>标题</label>
        <input type="text" name="title" required>
      </div>
      <div class="form-group">
        <label>分类</label>
        <select name="category">
          <option value="nature">自然</option>
          <option value="abstract">抽象</option>
          <option value="minimal">简约</option>
          <option value="dark">暗色</option>
          <option value="colorful">彩色</option>
        </select>
      </div>
      <div class="form-group">
        <label>标签（逗号分隔）</label>
        <input type="text" name="tags" placeholder="nature, landscape, mountain">
      </div>
      <div class="form-group">
        <label>描述</label>
        <textarea name="description" rows="4"></textarea>
      </div>
      <div class="form-group">
        <label>图片文件</label>
        <input type="file" name="file" accept="image/*" required>
      </div>
      <button type="submit">上传</button>
    </form>
    <br>
    <a href="/dashboard">← 返回仪表盘</a>
  </div>
</body>
</html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function handleStats(): Response {
  const stats = {
    totalWallpapers: 1234,
    totalDownloads: 45678,
    activeUsers: 2345,
    todayVisits: 567,
    categoryStats: [
      { category: 'nature', count: 250 },
      { category: 'abstract', count: 180 },
      { category: 'minimal', count: 150 },
    ],
  };

  return new Response(JSON.stringify(stats), {
    headers: { 'Content-Type': 'application/json' }
  });
}
