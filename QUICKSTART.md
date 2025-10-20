# 快速开始指南

## 🚀 5分钟快速启动

### 1. 克隆项目

```bash
cd /Users/zhaibin/Code/wallpaper-universe
```

### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装 Web 应用依赖
cd apps/web && npm install && cd ../..

# 安装桌面应用依赖
cd apps/desktop && npm install && cd ../..

# 安装移动应用依赖
cd apps/mobile && flutter pub get && cd ../..

# 安装后端 API 依赖
cd backend/api && npm install && cd ../..
cd backend/admin && npm install && cd ../..
```

### 3. 启动开发服务器

#### Web 应用 (推荐首先尝试)

```bash
cd apps/web
npm run dev
```

然后访问 http://localhost:3000

#### 桌面应用

```bash
cd apps/desktop
npm run tauri dev
```

#### 移动应用

```bash
cd apps/mobile
flutter run
```

#### 后端 API

```bash
cd backend/api
npm run dev
```

## 📋 Git 提交工作流

### 初始化 Git（如果还没有）

```bash
cd /Users/zhaibin/Code/wallpaper-universe
git init
git add .
git commit -m "feat: initial project setup with full stack implementation"
```

### 连接到 GitHub

```bash
# 创建新的 GitHub 仓库后
git remote add origin https://github.com/zhaibin/wallpaper-universe.git
git branch -M main
git push -u origin main
```

### 日常开发流程

```bash
# 创建新分支
git checkout -b feature/your-feature-name

# 进行修改后
git add .
git commit -m "feat: your feature description"

# 推送到 GitHub
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

## ☁️ Cloudflare 部署

### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 创建 KV Namespace

```bash
wrangler kv:namespace create "WALLPAPER_CACHE"
wrangler kv:namespace create "WALLPAPER_CACHE" --preview
```

记录返回的 ID，更新到 `backend/*/wrangler.toml` 文件中。

### 4. 部署 API Worker

```bash
cd backend/api
npm run deploy
```

### 5. 部署 Admin Worker

```bash
cd backend/admin
npm run deploy
```

### 6. 部署 Web 应用到 Cloudflare Pages

方法 1: GitHub 集成（推荐）
1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard 中连接仓库
3. 配置构建设置（见下）

方法 2: 手动部署
```bash
cd apps/web
npm run build
npx wrangler pages deploy out --project-name=anywallpaper-web
```

## 🔧 GitHub Actions 设置

在 GitHub 仓库设置中添加 Secrets：

1. 进入 `Settings` > `Secrets and variables` > `Actions`
2. 添加以下 secrets：

```
CLOUDFLARE_API_TOKEN=你的-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=你的-cloudflare-account-id
```

获取 API Token：
1. 访问 Cloudflare Dashboard
2. 进入 `My Profile` > `API Tokens`
3. 创建 Token，选择 "Edit Cloudflare Workers" 模板

## 📱 测试各平台

### Web 浏览器测试

```bash
cd apps/web
npm run dev
# 访问 http://localhost:3000
```

### 桌面应用测试

```bash
cd apps/desktop
npm run tauri dev
```

### 移动应用测试

```bash
cd apps/mobile

# Android 模拟器
flutter run

# iOS 模拟器 (仅 macOS)
flutter run -d ios

# 真机调试
flutter devices
flutter run -d <device-id>
```

### API 测试

```bash
cd backend/api
npm run dev

# 测试 API
curl http://localhost:8787/health
curl http://localhost:8787/v1/wallpapers
```

## 🏗️ 构建生产版本

### Web 应用

```bash
cd apps/web
npm run build
npm run start  # 预览生产构建
```

### 桌面应用

```bash
cd apps/desktop
npm run tauri build

# 构建产物位于:
# macOS: src-tauri/target/release/bundle/dmg/
# Windows: src-tauri/target/release/bundle/msi/
# Linux: src-tauri/target/release/bundle/appimage/
```

### 移动应用

```bash
cd apps/mobile

# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS (需要 macOS)
flutter build ios --release
```

## 🔍 常用命令

### 代码检查

```bash
# Web
cd apps/web
npm run lint

# Mobile
cd apps/mobile
flutter analyze
```

### 代码格式化

```bash
# TypeScript/JavaScript
npx prettier --write "**/*.{ts,tsx,js,jsx,json}"

# Dart
cd apps/mobile
flutter format .
```

### 查看日志

```bash
# Cloudflare Workers
wrangler tail

# Web 开发服务器
cd apps/web
npm run dev

# 移动应用
flutter logs
```

## 📚 更多资源

- [完整 README](README.md)
- [项目总结](PROJECT_SUMMARY.md)
- [设置指南](docs/SETUP.md)
- [Cloudflare 部署](docs/cloudflare.md)
- [贡献指南](CONTRIBUTING.md)

## ❓ 遇到问题？

1. 查看 [常见问题](docs/SETUP.md#常见问题)
2. 搜索 [GitHub Issues](https://github.com/zhaibin/wallpaper-universe/issues)
3. 创建新的 Issue 寻求帮助

---

**祝你开发愉快！** 🎉

