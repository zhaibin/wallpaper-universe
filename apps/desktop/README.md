# AnyWallpaper Desktop

基于 Tauri 的跨平台桌面壁纸应用，支持 Windows、macOS 和 Linux。

## 功能特性

- 🖼️ 浏览精选壁纸库
- ⚡ 一键设置桌面壁纸
- 🎨 现代化UI设计
- 🚀 轻量级，性能优秀
- 🔄 自动同步在线壁纸

## 开发

### 前置要求

- Node.js 18+
- Rust 1.70+
- 平台特定依赖：
  - **Windows**: WebView2 Runtime
  - **macOS**: Xcode Command Line Tools
  - **Linux**: webkit2gtk, libappindicator

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run tauri dev
```

### 构建生产版本

```bash
npm run tauri build
```

构建产物位于 `src-tauri/target/release/bundle/`

## 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Rust + Tauri
- **样式**: CSS3

## 支持的平台

- Windows 10/11
- macOS 10.15+
- Linux (主流发行版)

## License

MIT

