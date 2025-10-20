# AnyWallpaper - 跨平台壁纸应用

<div align="center">

![AnyWallpaper Logo](https://via.placeholder.com/200x200?text=AnyWallpaper)

**精选高清壁纸，支持 iOS、Android、Windows、macOS、Linux 和 Web**

[![CI](https://github.com/zhaibin/wallpaper-universe/workflows/CI/badge.svg)](https://github.com/zhaibin/wallpaper-universe/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/zhaibin/wallpaper-universe/pulls)

[English](README_EN.md) | 简体中文

</div>

## ✨ 功能特性

### 🖥️ 桌面应用（Windows/macOS/Linux）
- ⚡ 基于 Tauri 的轻量级桌面应用
- 🎨 现代化 UI 设计
- 🖼️ 一键设置系统壁纸
- 💾 壁纸下载和管理
- 🌓 深色/浅色主题

### 📱 移动应用（iOS/Android）
- 🎯 基于 Flutter 的原生体验
- 📦 瀑布流壁纸展示
- ❤️ 收藏功能
- 🔄 下拉刷新
- 📂 分类浏览

### 🌐 Web 应用
- ⚡ Next.js 14 + React 18
- 🎭 流畅的动画效果
- 📱 完全响应式设计
- 🚀 快速加载和 SEO 优化

### 🔧 后端 API
- ☁️ Cloudflare Workers 无服务器架构
- 🌍 全球边缘节点部署
- 💨 超快响应速度
- 🔒 安全的认证系统

## 🏗️ 项目结构

```
wallpaper-universe/
├── apps/                      # 应用程序
│   ├── desktop/              # 桌面应用 (Tauri + React)
│   ├── mobile/               # 移动应用 (Flutter)
│   └── web/                  # Web应用 (Next.js)
├── backend/                   # 后端服务
│   ├── api/                  # API Worker
│   ├── admin/                # 管理后台 Worker
│   └── shared/               # 共享代码
├── packages/                  # 共享包
│   └── core/                 # 核心功能
├── docs/                      # 文档
├── scripts/                   # 脚本
└── .github/                   # GitHub 配置
    └── workflows/            # CI/CD 工作流
```

## 🚀 快速开始

### 前置要求

- **Node.js** 18+ (Web、桌面、后端) ✅ 已验证
- **Flutter** 3.0+ (移动应用，可选)
- **Rust** 1.70+ (桌面应用，可选)
- **Cloudflare 账号** (后端部署)
- **Wrangler CLI** (已安装) ✅

### 项目状态

📊 **项目统计**
- ✅ 代码文件: 87 个
- ✅ 代码行数: 15,159 行
- ✅ 后端 API: 本地测试通过
- ✅ Git 仓库: 已初始化

### 克隆仓库

```bash
git clone https://github.com/zhaibin/wallpaper-universe.git
cd wallpaper-universe
```

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 或者分别安装各个项目的依赖
cd apps/web && npm install
cd ../desktop && npm install
cd ../../backend/api && npm install
```

### 开发

#### Web 应用

```bash
cd apps/web
npm run dev
# 访问 http://localhost:3000
```

#### 桌面应用

```bash
cd apps/desktop
npm run dev
# 或使用 Tauri
npm run tauri dev
```

#### 移动应用

```bash
cd apps/mobile
flutter pub get
flutter run
```

#### 后端 API

```bash
cd backend/api
npm run dev
# 使用 Wrangler 本地开发服务器
```

## 📦 构建和部署

### Web 应用

```bash
cd apps/web
npm run build

# 部署到 Cloudflare Pages
# 自动通过 GitHub Actions 部署
```

### 桌面应用

```bash
cd apps/desktop
npm run tauri build

# 构建产物位于 src-tauri/target/release/bundle/
```

### 移动应用

```bash
cd apps/mobile

# Android
flutter build apk --release
flutter build appbundle --release

# iOS
flutter build ios --release
```

### 后端 API

```bash
cd backend/api
npm run deploy

# 或通过 GitHub Actions 自动部署
```

## 🛠️ 技术栈

### 前端
- **Web**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Desktop**: Tauri, React, TypeScript, Vite
- **Mobile**: Flutter, Dart

### 后端
- **API**: Cloudflare Workers, TypeScript
- **存储**: Cloudflare KV, D1 Database
- **CDN**: Cloudflare CDN

### DevOps
- **CI/CD**: GitHub Actions
- **部署**: Cloudflare Pages, Cloudflare Workers
- **监控**: Cloudflare Analytics

## 📖 文档

- [项目架构](docs/architecture.md)
- [API 文档](docs/api.md)
- [Cloudflare 部署指南](docs/cloudflare.md)
- [贡献指南](CONTRIBUTING.md)

## 🤝 贡献

欢迎贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解如何参与项目。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 环境变量

### Web 应用

创建 `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.anywallpaper.net/v1
```

### 后端 API

在 Cloudflare Workers Dashboard 设置：

```env
JWT_SECRET=your-secret-key
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

## 🔐 GitHub Secrets

在 GitHub 仓库设置以下 Secrets：

```
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

## 📊 项目状态

- ✅ Web 应用
- ✅ 桌面应用（基础功能）
- ✅ 移动应用（基础功能）
- ✅ 后端 API
- ✅ CI/CD 流程
- 🚧 数据库集成
- 🚧 用户认证系统
- 🚧 管理后台完善

## 🗺️ 路线图

### v0.2.0
- [ ] 完整的用户认证系统
- [ ] D1 数据库集成
- [ ] 图片上传和 CDN 存储
- [ ] 高级搜索功能

### v0.3.0
- [ ] 社区功能（评论、点赞）
- [ ] 用户上传壁纸
- [ ] AI 壁纸推荐
- [ ] 多语言支持

### v1.0.0
- [ ] 完整的生产环境部署
- [ ] 移动应用商店发布
- [ ] 桌面应用分发
- [ ] 完整文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 作者

**AnyWallpaper Team**

## 🙏 致谢

- [Cloudflare](https://www.cloudflare.com/) - 提供优秀的边缘计算平台
- [Tauri](https://tauri.app/) - 现代化的桌面应用框架
- [Flutter](https://flutter.dev/) - 跨平台移动应用框架
- [Next.js](https://nextjs.org/) - React 应用框架

## 📧 联系我们

- Website: https://anywallpaper.net
- GitHub: https://github.com/zhaibin/wallpaper-universe
- Email: contact@anywallpaper.net

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️**

Made with ❤️ by AnyWallpaper Team

</div>
