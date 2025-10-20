# AnyWallpaper Backend

基于 Cloudflare Workers 的无服务器后端 API。

## 项目结构

```
backend/
├── api/              # 主 API Worker
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── wrangler.toml
├── admin/            # 管理后台 Worker
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── wrangler.toml
├── web-app/          # Web 应用 Worker
│   ├── dist/
│   ├── package.json
│   └── wrangler.toml
└── shared/           # 共享代码
    ├── auth.ts
    ├── kv.ts
    └── index.ts
```

## 功能特性

### API Worker (`/backend/api`)

- ✅ 壁纸列表 API
- ✅ 壁纸详情 API
- ✅ 分类管理
- ✅ 用户收藏（需要认证）
- ✅ KV 缓存
- ✅ CORS 支持

### Admin Worker (`/backend/admin`)

- ✅ 管理仪表盘
- ✅ 壁纸管理
- ✅ 上传功能
- ✅ 统计数据
- ✅ JWT 认证

## API 端点

### 公开端点

```
GET  /health                  # 健康检查
GET  /v1/wallpapers          # 获取壁纸列表
GET  /v1/wallpapers/:id      # 获取壁纸详情
GET  /v1/categories          # 获取分类列表
```

### 认证端点（需要 Bearer Token）

```
GET  /v1/user/favorites      # 获取用户收藏
POST /v1/user/favorites      # 添加收藏
```

## 开发

### 前置要求

- Node.js 18+
- Cloudflare 账号
- Wrangler CLI

### 安装 Wrangler

```bash
npm install -g wrangler
```

### 登录 Cloudflare

```bash
wrangler login
```

### 开发模式

```bash
# API Worker
cd backend/api
npm install
npm run dev

# Admin Worker
cd backend/admin
npm install
npm run dev
```

### 部署

```bash
# 部署 API
cd backend/api
npm run deploy

# 部署 Admin
cd backend/admin
npm run deploy
```

## 配置

### KV Namespace

创建 KV namespace：

```bash
wrangler kv:namespace create "WALLPAPER_CACHE"
```

将返回的 ID 更新到 `wrangler.toml` 中：

```toml
[[kv_namespaces]]
binding = "WALLPAPER_CACHE"
id = "your-kv-namespace-id"
```

### D1 Database (可选)

创建 D1 数据库：

```bash
wrangler d1 create anywallpaper-db
```

执行数据库迁移：

```bash
wrangler d1 execute anywallpaper-db --file=./schema.sql
```

### 环境变量

在 Cloudflare Workers Dashboard 中设置：

- `API_URL`: API 基础 URL
- `JWT_SECRET`: JWT 密钥（用于认证）

### 自定义域名

在 `wrangler.toml` 中配置：

```toml
routes = [
  { pattern = "api.anywallpaper.net/*", zone_name = "anywallpaper.net" }
]
```

## 认证

默认使用简单的 Bearer Token 认证。在生产环境中，建议：

1. 实现完整的 JWT 验证
2. 使用 OAuth 2.0
3. 集成第三方认证服务（如 Auth0、Clerk）

示例请求：

```bash
curl -H "Authorization: Bearer demo-token" \
  https://api.anywallpaper.net/v1/user/favorites
```

## 缓存策略

- 壁纸列表缓存 60 秒
- 使用 Cloudflare KV 存储
- 支持缓存失效和更新

## 性能优化

- ✅ 全球边缘节点部署
- ✅ KV 缓存层
- ✅ CORS 优化
- ✅ 自动缩放

## 监控

查看日志：

```bash
wrangler tail
```

查看分析数据：

```bash
wrangler pages deployment tail
```

## 成本

Cloudflare Workers 免费套餐：
- 每天 100,000 次请求
- 10ms CPU 时间/请求

KV 免费套餐：
- 100,000 次读取/天
- 1,000 次写入/天
- 1GB 存储

## 技术栈

- **运行时**: Cloudflare Workers
- **语言**: TypeScript
- **存储**: Cloudflare KV
- **数据库**: Cloudflare D1 (可选)
- **部署**: Wrangler CLI

## License

MIT

