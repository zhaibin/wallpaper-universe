# AnyWallpaper Web

基于 Next.js 的现代化壁纸网站。

## 功能特性

- 🎨 现代化UI设计
- 🖼️ 响应式壁纸展示
- ⚡ 快速加载和优化
- 🌓 深色模式支持
- 📱 移动端适配
- 🎭 流畅的动画效果
- 🔍 分类浏览
- ⬇️ 壁纸下载

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **数据获取**: SWR
- **图片优化**: Next.js Image

## 开发

### 前置要求

- Node.js 18+
- npm/yarn/pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建生产版本

```bash
npm run build
npm run start
```

## 项目结构

```
app/
├── components/          # 组件
│   ├── Header.tsx      # 头部
│   ├── Footer.tsx      # 底部
│   ├── Hero.tsx        # 首页Banner
│   ├── CategoryFilter.tsx  # 分类筛选
│   └── WallpaperGrid.tsx   # 壁纸网格
├── layout.tsx          # 布局
├── page.tsx            # 首页
└── globals.css         # 全局样式
```

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 自动部署

### Cloudflare Pages

1. 构建命令: `npm run build`
2. 输出目录: `.next`
3. 环境变量: 根据需要配置

### 其他平台

支持任何支持 Next.js 的平台，如 Netlify、Railway 等。

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=https://api.anywallpaper.net/v1
```

## License

MIT

