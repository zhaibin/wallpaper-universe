# 部署指南

本文档提供详细的部署步骤。

## 📋 部署前检查清单

- [x] 项目代码已完成
- [x] Git 仓库已初始化
- [x] 本地测试通过（API）
- [ ] GitHub 仓库已创建
- [ ] Cloudflare 账号已准备
- [ ] GitHub Secrets 已配置

## 🔧 第一步：推送到 GitHub

### 1. 创建 GitHub 仓库

在 GitHub 上创建新仓库 `wallpaper-universe`（不要初始化 README）

### 2. 推送代码

```bash
cd /Users/zhaibin/Code/wallpaper-universe

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/wallpaper-universe.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 3. 验证推送

访问 `https://github.com/你的用户名/wallpaper-universe` 确认代码已上传。

## ☁️ 第二步：部署到 Cloudflare

### 1. 登录 Cloudflare

```bash
wrangler login
```

### 2. 创建 KV Namespace

```bash
# 创建生产环境 KV
wrangler kv:namespace create "WALLPAPER_CACHE"

# 记录返回的 ID，例如：
# id = "abc123def456"
```

### 3. 更新 wrangler.toml

编辑 `backend/api/wrangler.toml` 和 `backend/admin/wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "WALLPAPER_CACHE"
id = "你的实际KV-ID"  # 替换为上面创建的 ID
```

### 4. 部署 Workers

```bash
# 部署 API Worker
cd backend/api
npm run deploy

# 部署 Admin Worker  
cd ../admin
npm run deploy
```

### 5. 测试部署

```bash
# 测试 API
curl https://anywallpaper-api.你的用户名.workers.dev/health
curl https://anywallpaper-api.你的用户名.workers.dev/v1/wallpapers
```

## 🌐 第三步：部署 Web 应用到 Cloudflare Pages

### 方法 1: 通过 GitHub 集成（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages** → **Create a project**
3. 连接 GitHub 仓库
4. 配置构建设置：
   - **Framework preset**: Next.js
   - **Build command**: `cd apps/web && npm install && npm run build`
   - **Build output directory**: `apps/web/out` 或 `apps/web/.next`
   - **Root directory**: `/`
   - **Node version**: 18

5. 添加环境变量：
   ```
   NEXT_PUBLIC_API_URL=https://anywallpaper-api.你的用户名.workers.dev/v1
   ```

6. 点击 **Save and Deploy**

### 方法 2: 使用 Wrangler CLI

```bash
cd apps/web
npm install
npm run build
npx wrangler pages deploy .next --project-name=anywallpaper-web
```

## 🔐 第四步：配置 GitHub Actions

### 1. 获取 Cloudflare API Token

1. 访问 Cloudflare Dashboard
2. 进入 **My Profile** → **API Tokens**
3. 创建 Token，选择 **Edit Cloudflare Workers** 模板
4. 权限设置：
   - Account > Workers Scripts > Edit
   - Account > Cloudflare Pages > Edit
   - Zone > Workers Routes > Edit

### 2. 配置 GitHub Secrets

在 GitHub 仓库设置中添加：

1. **CLOUDFLARE_API_TOKEN**
   - 粘贴上面创建的 API Token

2. **CLOUDFLARE_ACCOUNT_ID**
   - 在 Cloudflare Dashboard 右侧栏找到

添加路径：`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 3. 测试 GitHub Actions

推送代码到 `main` 分支：

```bash
git add .
git commit -m "chore: update deployment configuration"
git push
```

查看 Actions 运行状态：
`https://github.com/你的用户名/wallpaper-universe/actions`

## 🧪 第五步：测试部署

### 测试后端 API

```bash
# Health Check
curl https://api.anywallpaper.com/health
# 或
curl https://anywallpaper-api.你的用户名.workers.dev/health

# Wallpapers API
curl https://api.anywallpaper.com/v1/wallpapers
# 或  
curl https://anywallpaper-api.你的用户名.workers.dev/v1/wallpapers

# Categories API
curl https://api.anywallpaper.com/v1/categories
```

### 测试 Web 应用

访问：
- `https://anywallpaper-web.pages.dev`
- 或你配置的自定义域名

### 测试 Admin 后台

访问：
- `https://anywallpaper-admin.你的用户名.workers.dev`
- 使用 Bearer Token: `demo-token`

```bash
curl -H "Authorization: Bearer demo-token" \
  https://anywallpaper-admin.你的用户名.workers.dev/dashboard
```

## 🎯 配置自定义域名（可选）

### 为 Workers 配置域名

1. 在 Cloudflare Dashboard 找到你的域名
2. 进入 **Workers Routes**
3. 添加路由：
   - API: `api.yourdomain.com/*` → `anywallpaper-api`
   - Admin: `admin.yourdomain.com/*` → `anywallpaper-admin`

### 为 Pages 配置域名

1. 进入 Pages 项目设置
2. **Custom domains** → **Set up a custom domain**
3. 输入域名，如 `www.yourdomain.com`
4. 按照提示配置 DNS

## 📊 监控和维护

### 查看日志

```bash
# Worker 实时日志
cd backend/api
wrangler tail

# Pages 部署日志
# 在 Cloudflare Dashboard 查看
```

### 查看分析数据

在 Cloudflare Dashboard：
- **Workers & Pages** → 选择项目 → **Analytics**

### 更新部署

```bash
# 更新代码后
git add .
git commit -m "feat: 新功能"
git push

# GitHub Actions 会自动部署
```

## ⚠️ 故障排查

### Workers 部署失败

1. 检查 wrangler.toml 配置
2. 验证 KV Namespace ID
3. 查看错误日志：`wrangler tail`

### Pages 构建失败

1. 检查构建命令和输出目录
2. 验证环境变量
3. 查看构建日志

### API 无法访问

1. 检查 Workers 是否部署成功
2. 验证路由配置
3. 测试 CORS 设置

## 📈 性能优化建议

1. **启用缓存**
   - 配置适当的 Cache-Control 头
   - 使用 KV 缓存热门数据

2. **优化图片**
   - 使用 Cloudflare Images（可选）
   - 配置图片优化和 CDN

3. **监控性能**
   - 设置 Cloudflare Analytics
   - 配置性能预算

## 🔒 安全建议

1. **更新 JWT Secret**
   - 使用强随机密钥
   - 定期轮换密钥

2. **限制 API 访问**
   - 实现速率限制
   - 配置 WAF 规则

3. **验证输入**
   - 所有用户输入必须验证
   - 防止 XSS 和 SQL 注入

## 📞 获取帮助

遇到问题？

1. 查看 [Cloudflare 文档](https://developers.cloudflare.com/)
2. 搜索 [GitHub Issues](https://github.com/你的用户名/wallpaper-universe/issues)
3. 提交新的 Issue

---

**部署完成后，记得更新 README 中的链接！** 🎉

