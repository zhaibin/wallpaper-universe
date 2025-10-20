# 🚀 快速参考卡片

## 📍 关键信息

### 仓库
- **GitHub**: https://github.com/zhaibin/wallpaper-universe
- **分支**: main
- **提交**: 8 次

### 域名配置
- **主域名**: anywallpaper.net
- **Web**: www.anywallpaper.net
- **API**: api.anywallpaper.net
- **Admin**: admin.anywallpaper.net

### 已部署服务
- **API**: https://anywallpaper-api.xants.workers.dev
- **Admin**: https://anywallpaper-admin.xants.workers.dev

### Cloudflare 资源
- **KV ID**: 4eca079022f14b6183fbc87069cc7deb
- **R2 Bucket**: wallpapers
- **Workers AI**: Llama 3.2 Vision

## 🔑 常用命令

### 本地开发
```bash
# Web 应用
cd apps/web && npm run dev

# 桌面应用
cd apps/desktop && npm run tauri dev

# 移动应用
cd apps/mobile && flutter run

# API Worker
cd backend/api && npm run dev
```

### 部署
```bash
# 部署 API
cd backend/api && npm run deploy

# 部署 Admin
cd backend/admin && npm run deploy

# 推送到 GitHub
git add . && git commit -m "message" && git push
```

### 测试
```bash
# 测试 API
curl https://anywallpaper-api.xants.workers.dev/health
curl https://anywallpaper-api.xants.workers.dev/v1/wallpapers

# 测试上传
curl -X POST https://anywallpaper-api.xants.workers.dev/v1/upload \
  -H "Authorization: Bearer demo-token" \
  -F "file=@test.jpg"
```

## 🎯 核心功能

### 上传功能
- **平台**: Web, Windows, macOS（无移动端）
- **格式**: 图片（JPG/PNG/WebP/GIF）、视频（MP4/WebM）
- **大小**: 最大 50MB
- **AI 分析**: 自动生成描述、标签、颜色

### AI 分析输出
- 50字描述
- 三级标签（带权重）
- 主要颜色（3-5种）
- 物体检测
- 情绪和风格

### 标签示例
```
一级: ["自然景观", 0.9]
二级: ["山脉", 0.8], ["日出", 0.7]
三级: ["雪山", 0.85], ["晨光", 0.75], ["云海", 0.7]
```

### 颜色示例
```
[
  { hex: "#FF6B6B", rgb: [255,107,107], percentage: 35, name: "珊瑚红" },
  { hex: "#4ECDC4", rgb: [78,205,196], percentage: 30, name: "青色" }
]
```

## 📝 待办事项

### 立即执行
- [ ] 配置自定义域名
- [ ] 部署 Web 应用到 Pages
- [ ] 更新 JWT_SECRET

### 后续优化
- [ ] 创建 D1 数据库
- [ ] 实现真实用户认证
- [ ] 添加图片压缩和缩略图生成
- [ ] 实现推荐算法

## 🔗 快速链接

- [完整文档](README.md)
- [部署指南](DEPLOYMENT_GUIDE.md)
- [部署状态](DEPLOYMENT_STATUS.md)
- [数据库 Schema](backend/schema.sql)

---

**最后更新**: 2025-10-20  
**版本**: 0.1.0  
**状态**: 🟢 已部署运行
