# Cloudflare 部署指南

本指南将帮助你在 Cloudflare 上部署 AnyWallpaper 的后端和 Web 应用。

## 前置要求

1. **Cloudflare 账号**: [注册账号](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI**: 安装 Cloudflare Workers CLI

```bash
npm install -g wrangler
```

3. **登录 Cloudflare**

```bash
wrangler login
```

## 部署步骤

### 1. 创建 KV Namespace

KV 用于缓存壁纸数据：

```bash
# 生产环境
wrangler kv:namespace create "WALLPAPER_CACHE"

# 开发环境
wrangler kv:namespace create "WALLPAPER_CACHE" --preview
```

记录返回的 ID，更新到 `wrangler.toml` 中。

### 2. 创建 D1 Database（可选）

D1 用于持久化数据存储：

```bash
wrangler d1 create anywallpaper-db
```

创建数据库表：

```bash
wrangler d1 execute anywallpaper-db --file=./schema.sql
```

### 3. 部署 API Worker

```bash
cd backend/api
npm install
npm run deploy
```

### 4. 部署 Admin Worker

```bash
cd backend/admin
npm install
npm run deploy
```

### 5. 部署 Web 应用到 Cloudflare Pages

#### 方法 1: 通过 GitHub 集成（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages**
3. 点击 **Create a project**
4. 连接你的 GitHub 仓库
5. 配置构建设置：
   - **Build command**: `cd apps/web && npm install && npm run build`
   - **Build output directory**: `apps/web/out`
   - **Root directory**: `/`

#### 方法 2: 使用 Wrangler CLI

```bash
cd apps/web
npm run build
npx wrangler pages deploy out --project-name=anywallpaper-web
```

## 配置自定义域名

### 为 Workers 配置域名

1. 在 Cloudflare Dashboard 中找到你的域名
2. 进入 **Workers Routes**
3. 添加路由：
   - API: `api.anywallpaper.net/*` -> `anywallpaper-api`
   - Admin: `admin.anywallpaper.net/*` -> `anywallpaper-admin`

或在 `wrangler.toml` 中配置：

```toml
routes = [
  { pattern = "api.anywallpaper.net/*", zone_name = "anywallpaper.net" }
]
```

### 为 Pages 配置域名

1. 进入 Pages 项目设置
2. 点击 **Custom domains**
3. 添加域名 `www.anywallpaper.net`

## 环境变量

### Workers 环境变量

在 Cloudflare Dashboard 中设置：

```
JWT_SECRET=your-secret-key-here
API_URL=https://api.anywallpaper.net
```

或使用 wrangler：

```bash
wrangler secret put JWT_SECRET
```

### Pages 环境变量

在 Pages 项目设置中添加：

```
NEXT_PUBLIC_API_URL=https://api.anywallpaper.net/v1
```

## 更新 wrangler.toml

### backend/api/wrangler.toml

```toml
name = "anywallpaper-api"
main = "src/index.ts"
compatibility_date = "2025-10-20"

[[d1_databases]]
binding = "DB"
database_name = "anywallpaper-db"
database_id = "your-database-id"

[[kv_namespaces]]
binding = "WALLPAPER_CACHE"
id = "your-kv-namespace-id"

routes = [
  { pattern = "api.anywallpaper.net/*", zone_name = "anywallpaper.net" }
]
```

### backend/admin/wrangler.toml

```toml
name = "anywallpaper-admin"
main = "src/index.ts"
compatibility_date = "2025-10-20"

[[kv_namespaces]]
binding = "WALLPAPER_CACHE"
id = "your-kv-namespace-id"

routes = [
  { pattern = "admin.anywallpaper.net/*", zone_name = "anywallpaper.net" }
]
```

## 自动部署（GitHub Actions）

项目已配置 GitHub Actions，当推送到 main 分支时自动部署。

需要在 GitHub 仓库设置以下 Secrets：

1. **CLOUDFLARE_API_TOKEN**
   - 在 Cloudflare Dashboard 创建 API Token
   - 权限：Account > Workers Scripts > Edit, Account > Cloudflare Pages > Edit

2. **CLOUDFLARE_ACCOUNT_ID**
   - 在 Cloudflare Dashboard 右侧栏找到

## 监控和日志

### 查看实时日志

```bash
# API Worker
cd backend/api
wrangler tail

# Admin Worker
cd backend/admin
wrangler tail
```

### 查看分析数据

在 Cloudflare Dashboard 中：
1. 进入 **Workers & Pages**
2. 选择你的 Worker
3. 查看 **Analytics** 标签

## 性能优化

### 缓存策略

```typescript
// 设置缓存头
response.headers.set('Cache-Control', 'public, max-age=3600')

// 使用 KV 缓存
await env.WALLPAPER_CACHE.put(key, value, { expirationTtl: 3600 })
```

### CDN 优化

Cloudflare 会自动缓存静态资源，但你可以自定义：

```typescript
// 在 Workers 中设置缓存
const cache = caches.default
const cachedResponse = await cache.match(request)
if (cachedResponse) {
  return cachedResponse
}
```

## 成本估算

### Cloudflare Workers 免费套餐
- 100,000 请求/天
- 无限带宽

### Cloudflare Pages 免费套餐
- 500 次构建/月
- 无限请求
- 无限带宽

### KV 免费套餐
- 100,000 读取/天
- 1,000 写入/天
- 1 GB 存储

### D1 免费套餐（Beta）
- 5 GB 存储
- 500 万行读取/天
- 10 万行写入/天

## 故障排查

### Worker 部署失败

```bash
# 检查 wrangler.toml 配置
wrangler publish --dry-run

# 查看详细错误
wrangler publish --verbose
```

### Pages 构建失败

1. 检查构建日志
2. 确认 build 命令和输出目录正确
3. 检查环境变量是否设置

### KV 数据问题

```bash
# 列出所有键
wrangler kv:key list --namespace-id=your-namespace-id

# 获取值
wrangler kv:key get "key-name" --namespace-id=your-namespace-id

# 删除键
wrangler kv:key delete "key-name" --namespace-id=your-namespace-id
```

## 安全建议

1. **使用强密钥**: 为 JWT_SECRET 使用强随机密钥
2. **限制 API 访问**: 实现速率限制
3. **验证输入**: 始终验证用户输入
4. **使用 HTTPS**: Cloudflare 自动提供 SSL

## 进一步阅读

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler 文档](https://developers.cloudflare.com/workers/wrangler/)
- [KV 文档](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [D1 文档](https://developers.cloudflare.com/d1/)

---

如有问题，请提交 [Issue](https://github.com/zhaibin/wallpaper-universe/issues)。
