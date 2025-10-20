# 项目设置指南

本文档将指导你完成 AnyWallpaper 项目的完整设置。

## 目录

1. [本地开发环境](#本地开发环境)
2. [GitHub 配置](#github-配置)
3. [Cloudflare 配置](#cloudflare-配置)
4. [环境变量](#环境变量)
5. [数据库设置](#数据库设置)

## 本地开发环境

### 1. 安装必要工具

#### Node.js 和 npm

```bash
# macOS (使用 Homebrew)
brew install node

# 或下载安装包
https://nodejs.org/

# 验证安装
node --version  # 应该是 v18+
npm --version
```

#### Flutter (用于移动应用)

```bash
# macOS
brew install --cask flutter

# 或按照官方指南
https://docs.flutter.dev/get-started/install

# 验证安装
flutter doctor
```

#### Rust (用于桌面应用)

```bash
# 安装 rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 验证安装
rustc --version
cargo --version
```

#### Wrangler (Cloudflare CLI)

```bash
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

### 2. 克隆项目

```bash
git clone https://github.com/anywallpaper/wallpaper-universe.git
cd wallpaper-universe
```

### 3. 安装项目依赖

```bash
# 安装根目录依赖
npm install

# 分别安装各子项目依赖
cd apps/web && npm install && cd ../..
cd apps/desktop && npm install && cd ../..
cd apps/mobile && flutter pub get && cd ../..
cd backend/api && npm install && cd ../..
cd backend/admin && npm install && cd ../..
```

### 4. 启动开发服务器

#### Web 应用

```bash
cd apps/web
npm run dev
# 访问 http://localhost:3000
```

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
# 访问 http://localhost:8787
```

## GitHub 配置

### 1. Fork 仓库

在 GitHub 上 Fork 这个仓库到你的账号。

### 2. 配置 Secrets

在你的 GitHub 仓库设置中添加以下 Secrets：

1. 进入仓库设置：`Settings` > `Secrets and variables` > `Actions`
2. 添加以下 secrets：

```
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
```

### 3. 启用 GitHub Actions

确保在 `Settings` > `Actions` > `General` 中启用了 Actions。

## Cloudflare 配置

### 1. 创建 Cloudflare 账号

访问 [Cloudflare](https://dash.cloudflare.com/sign-up) 注册账号。

### 2. 创建 API Token

1. 进入 `My Profile` > `API Tokens`
2. 点击 `Create Token`
3. 选择 `Edit Cloudflare Workers` 模板
4. 或自定义权限：
   - Account > Workers Scripts > Edit
   - Account > Cloudflare Pages > Edit
   - Zone > Workers Routes > Edit

### 3. 创建 KV Namespace

```bash
# 生产环境
wrangler kv:namespace create "WALLPAPER_CACHE"

# 开发环境
wrangler kv:namespace create "WALLPAPER_CACHE" --preview
```

记录返回的 ID，更新到对应的 `wrangler.toml` 文件中。

### 4. 创建 D1 Database (可选)

```bash
wrangler d1 create anywallpaper-db
```

### 5. 添加域名

如果你有自己的域名：

1. 在 Cloudflare 中添加域名
2. 更新 DNS 记录
3. 在 `wrangler.toml` 中配置路由

## 环境变量

### Web 应用 (.env.local)

在 `apps/web/` 创建 `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.anywallpaper.com/v1
```

### 桌面应用

通常不需要环境变量，API URL 在代码中配置。

### 移动应用

在 `apps/mobile/lib/services/api_service.dart` 中配置 API URL。

### 后端 Workers

通过 Cloudflare Dashboard 或 wrangler 设置：

```bash
wrangler secret put JWT_SECRET
# 输入你的密钥
```

## 数据库设置

### 创建数据库表

1. 创建 `schema.sql`:

```sql
-- 壁纸表
CREATE TABLE wallpapers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  category TEXT,
  width INTEGER,
  height INTEGER,
  author TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallpaper_id TEXT,
  tag TEXT,
  FOREIGN KEY (wallpaper_id) REFERENCES wallpapers(id)
);

-- 用户收藏表
CREATE TABLE favorites (
  user_id TEXT,
  wallpaper_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, wallpaper_id)
);
```

2. 执行迁移:

```bash
wrangler d1 execute anywallpaper-db --file=./schema.sql
```

## 验证设置

### 1. 运行测试

```bash
# Web
cd apps/web
npm run test

# Mobile
cd apps/mobile
flutter test
```

### 2. 构建检查

```bash
# Web
cd apps/web
npm run build

# Desktop
cd apps/desktop
npm run build

# Mobile
cd apps/mobile
flutter build apk --debug
```

### 3. 部署测试

```bash
# 部署到开发环境
cd backend/api
wrangler deploy --env dev
```

## 常见问题

### Q: Flutter doctor 显示错误

A: 运行 `flutter doctor` 并按照提示安装缺失的组件。

### Q: Tauri 构建失败

A: 确保安装了所有平台依赖：
- macOS: Xcode Command Line Tools
- Linux: webkit2gtk, libappindicator
- Windows: WebView2

### Q: Wrangler 登录失败

A: 检查网络连接，尝试使用 API Token：

```bash
export CLOUDFLARE_API_TOKEN=your-token
```

### Q: npm install 失败

A: 清除缓存重试：

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 下一步

- 查看 [贡献指南](../CONTRIBUTING.md)
- 阅读 [Cloudflare 部署指南](cloudflare.md)
- 浏览 [API 文档](api.md)

---

需要帮助？请在 [GitHub Issues](https://github.com/anywallpaper/wallpaper-universe/issues) 提问。

