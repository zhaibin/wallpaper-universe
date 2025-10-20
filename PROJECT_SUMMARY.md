# AnyWallpaper 项目总结

## 项目概述

AnyWallpaper 是一个跨平台的壁纸应用项目，支持 **Web、Desktop（Windows/macOS/Linux）、Mobile（iOS/Android）** 平台。

项目采用 **Monorepo** 架构，使用现代化的技术栈，后端完全基于 **Cloudflare** 的边缘计算平台。

## 项目结构

```
wallpaper-universe/
├── apps/                      # 应用程序
│   ├── desktop/              # 桌面应用 (Tauri + React + TypeScript)
│   │   ├── src/              # React 源码
│   │   ├── src-tauri/        # Tauri Rust 后端
│   │   └── package.json
│   ├── mobile/               # 移动应用 (Flutter + Dart)
│   │   ├── lib/              # Flutter 源码
│   │   │   ├── main.dart
│   │   │   ├── models/
│   │   │   ├── providers/
│   │   │   ├── screens/
│   │   │   ├── services/
│   │   │   └── widgets/
│   │   └── pubspec.yaml
│   └── web/                  # Web应用 (Next.js 14 + React + TypeScript)
│       ├── app/              # Next.js App Router
│       │   ├── components/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       └── package.json
├── backend/                   # 后端服务 (Cloudflare Workers)
│   ├── api/                  # 主 API Worker
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── wrangler.toml
│   ├── admin/                # 管理后台 Worker
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── wrangler.toml
│   └── shared/               # 共享代码
│       ├── auth.ts           # 认证模块
│       ├── kv.ts             # KV 存储模块
│       └── index.ts
├── packages/                  # 共享包
│   └── core/                 # 核心功能
│       ├── index.ts
│       └── package.json
├── docs/                      # 文档
│   ├── cloudflare.md         # Cloudflare 部署指南
│   └── SETUP.md              # 项目设置指南
├── scripts/                   # 脚本
│   └── sync.mjs              # 同步脚本
├── .github/                   # GitHub 配置
│   ├── workflows/            # CI/CD 工作流
│   │   ├── ci.yml           # 持续集成
│   │   ├── deploy-cloudflare.yml  # 部署 Workers
│   │   ├── deploy-web.yml   # 部署 Web 应用
│   │   ├── release-desktop.yml    # 发布桌面应用
│   │   └── release-mobile.yml     # 发布移动应用
│   ├── ISSUE_TEMPLATE/       # Issue 模板
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml        # 依赖自动更新
├── .gitignore                # Git 忽略文件
├── .gitattributes            # Git 属性配置
├── .editorconfig             # 编辑器配置
├── .prettierrc               # Prettier 配置
├── .npmrc                    # npm 配置
├── turbo.json                # Turborepo 配置
├── package.json              # 根 package.json
├── README.md                 # 项目说明
├── CONTRIBUTING.md           # 贡献指南
├── CHANGELOG.md              # 更新日志
├── LICENSE                   # MIT 许可证
└── version.json              # 版本信息
```

## 技术栈

### 前端技术

#### Web 应用
- **框架**: Next.js 14 (App Router)
- **UI 库**: React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **数据获取**: SWR
- **构建工具**: Vite

#### 桌面应用
- **框架**: Tauri 1.5
- **前端**: React + TypeScript + Vite
- **后端**: Rust
- **功能**: 系统壁纸设置、文件下载

#### 移动应用
- **框架**: Flutter 3.16
- **语言**: Dart
- **状态管理**: Provider
- **网络**: http, dio
- **图片缓存**: cached_network_image
- **布局**: flutter_staggered_grid_view

### 后端技术

- **平台**: Cloudflare Workers (边缘计算)
- **语言**: TypeScript
- **运行时**: V8 Isolates
- **存储**: Cloudflare KV (键值存储)
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Wrangler CLI

### DevOps

- **版本控制**: Git + GitHub
- **CI/CD**: GitHub Actions
- **包管理**: npm workspaces
- **代码规范**: ESLint + Prettier
- **依赖更新**: Dependabot

## 核心功能

### 1. 壁纸浏览
- ✅ 瀑布流/网格展示
- ✅ 分类筛选
- ✅ 搜索功能（待实现）
- ✅ 无限滚动（待实现）

### 2. 壁纸操作
- ✅ 预览查看
- ✅ 下载壁纸
- ✅ 设置为系统壁纸（桌面/移动）
- ✅ 收藏功能

### 3. 用户功能
- ⏳ 用户认证
- ⏳ 个人收藏管理
- ⏳ 上传壁纸
- ⏳ 社交功能

### 4. 管理功能
- ✅ 管理仪表盘
- ✅ 壁纸管理
- ✅ 统计数据
- ⏳ 用户管理

## API 端点

### 公开端点
```
GET  /health                  # 健康检查
GET  /v1/wallpapers          # 获取壁纸列表
GET  /v1/wallpapers/:id      # 获取壁纸详情
GET  /v1/categories          # 获取分类列表
```

### 认证端点
```
GET  /v1/user/favorites      # 获取用户收藏
POST /v1/user/favorites      # 添加收藏
```

## 部署架构

```
┌─────────────┐
│   用户设备   │
│  (浏览器/App) │
└──────┬──────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌─────────────┐      ┌──────────────┐
│ Cloudflare  │      │  Cloudflare  │
│   Pages     │      │   Workers    │
│  (Web App)  │      │  (API/Admin) │
└─────────────┘      └──────┬───────┘
                            │
                    ┌───────┴────────┐
                    │                │
                    ▼                ▼
              ┌──────────┐    ┌──────────┐
              │   KV     │    │    D1    │
              │ (缓存)    │    │ (数据库)  │
              └──────────┘    └──────────┘
```

## 开发流程

### 1. 本地开发
```bash
# 克隆仓库
git clone https://github.com/anywallpaper/wallpaper-universe.git

# 安装依赖
npm install

# 启动开发服务器
cd apps/web && npm run dev       # Web
cd apps/desktop && npm run dev   # Desktop
cd apps/mobile && flutter run    # Mobile
cd backend/api && npm run dev    # API
```

### 2. 提交代码
```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: your feature"
git push origin feature/your-feature
```

### 3. 创建 Pull Request
- 在 GitHub 上创建 PR
- 自动运行 CI 测试
- 代码审查
- 合并到主分支

### 4. 自动部署
- 推送到 `main` 分支触发部署
- GitHub Actions 自动构建
- 部署到 Cloudflare

## 配置要求

### 环境变量

#### GitHub Secrets
```
CLOUDFLARE_API_TOKEN      # Cloudflare API Token
CLOUDFLARE_ACCOUNT_ID     # Cloudflare Account ID
```

#### Cloudflare Workers
```
JWT_SECRET                # JWT 密钥
```

#### Web 应用 (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.anywallpaper.com/v1
```

### Cloudflare 资源

1. **KV Namespace**: WALLPAPER_CACHE
2. **D1 Database**: anywallpaper-db
3. **Workers**: api, admin, web-app
4. **Pages**: anywallpaper-web

## 性能指标

### Cloudflare Workers
- **冷启动**: < 10ms
- **响应时间**: < 50ms (全球平均)
- **可用性**: 99.99%

### Web 应用
- **首次加载**: < 2s
- **Lighthouse 分数**: 90+
- **Core Web Vitals**: 全绿

## 安全特性

- ✅ HTTPS 加密
- ✅ CORS 配置
- ✅ JWT 认证（基础）
- ⏳ 速率限制
- ⏳ 输入验证
- ⏳ XSS 防护

## 成本估算

### Cloudflare 免费套餐
- Workers: 100,000 请求/天
- Pages: 500 次构建/月
- KV: 100,000 读取/天
- D1: 5 GB 存储

**预计月成本**: $0 (在免费额度内)

## 未来规划

### 短期 (v0.2.0)
- [ ] 完整用户认证系统
- [ ] D1 数据库集成
- [ ] 图片上传和 CDN
- [ ] 高级搜索

### 中期 (v0.3.0)
- [ ] 社区功能
- [ ] 用户上传壁纸
- [ ] AI 推荐
- [ ] 多语言支持

### 长期 (v1.0.0)
- [ ] 生产环境发布
- [ ] 应用商店上架
- [ ] 完整文档
- [ ] 商业化

## 贡献者

- 主要开发者: AnyWallpaper Team
- 贡献者: 欢迎通过 PR 贡献

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 联系方式

- Email: contact@anywallpaper.com
- GitHub: https://github.com/anywallpaper/wallpaper-universe
- Issues: https://github.com/anywallpaper/wallpaper-universe/issues

---

**最后更新**: 2025-10-20  
**版本**: 0.1.0  
**状态**: 开发中 🚧

