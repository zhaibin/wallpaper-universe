# AnyWallpaper Mobile

基于 Flutter 的跨平台移动壁纸应用，支持 iOS 和 Android。

## 功能特性

- 📱 精美的移动端UI设计
- 🖼️ 瀑布流壁纸展示
- ⚡ 一键设置壁纸
- 💾 壁纸下载功能
- ❤️ 收藏功能
- 🎨 分类浏览
- 🌓 深色/浅色主题
- 🔄 下拉刷新

## 开发

### 前置要求

- Flutter SDK 3.0+
- Dart SDK 3.0+
- Android Studio / Xcode (根据目标平台)

### 安装依赖

```bash
flutter pub get
```

### 运行

```bash
# Android
flutter run

# iOS
flutter run -d ios

# 指定设备
flutter devices
flutter run -d <device-id>
```

### 构建

```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release
```

## 目录结构

```
lib/
├── main.dart                 # 应用入口
├── models/                   # 数据模型
│   └── wallpaper.dart
├── providers/                # 状态管理
│   ├── wallpaper_provider.dart
│   └── theme_provider.dart
├── screens/                  # 页面
│   ├── home_screen.dart
│   ├── wallpaper_detail_screen.dart
│   ├── favorites_screen.dart
│   └── settings_screen.dart
├── services/                 # 服务
│   └── api_service.dart
└── widgets/                  # 组件
    └── wallpaper_card.dart
```

## 技术栈

- **框架**: Flutter
- **语言**: Dart
- **状态管理**: Provider
- **网络请求**: http, dio
- **图片缓存**: cached_network_image
- **本地存储**: shared_preferences
- **瀑布流**: flutter_staggered_grid_view

## 支持的平台

- iOS 11.0+
- Android 5.0+ (API 21+)

## License

MIT

