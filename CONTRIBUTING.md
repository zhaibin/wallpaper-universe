# 贡献指南

感谢你考虑为 AnyWallpaper 做出贡献！

## 行为准则

参与本项目即表示你同意遵守我们的行为准则。请保持友善和尊重。

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请通过 [GitHub Issues](https://github.com/zhaibin/wallpaper-universe/issues) 报告：

1. 使用清晰的标题描述问题
2. 提供详细的复现步骤
3. 说明期望的行为
4. 提供截图（如果适用）
5. 说明你的环境（操作系统、浏览器版本等）

### 提出功能建议

我们欢迎新功能建议！请通过 Issues 提出：

1. 清楚地描述你想要的功能
2. 解释为什么需要这个功能
3. 提供可能的实现方案

### 提交 Pull Request

1. **Fork 仓库**

```bash
git clone https://github.com/your-username/wallpaper-universe.git
cd wallpaper-universe
```

2. **创建分支**

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

3. **进行更改**

- 遵循项目的代码风格
- 添加必要的测试
- 更新相关文档

4. **提交更改**

```bash
git add .
git commit -m "feat: add some feature"
```

提交信息格式：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

5. **推送到 GitHub**

```bash
git push origin feature/your-feature-name
```

6. **创建 Pull Request**

- 提供清晰的 PR 标题和描述
- 关联相关的 Issue
- 确保所有 CI 检查通过

## 开发指南

### 代码风格

#### TypeScript/JavaScript
- 使用 2 空格缩进
- 使用单引号
- 添加适当的类型注解
- 遵循 ESLint 规则

#### Dart/Flutter
- 使用 2 空格缩进
- 遵循 Flutter 最佳实践
- 运行 `flutter analyze` 确保无警告

#### Rust
- 使用 4 空格缩进
- 遵循 Rust 编码规范
- 运行 `cargo fmt` 和 `cargo clippy`

### 测试

确保添加适当的测试：

```bash
# Web/Desktop
npm run test

# Mobile
cd apps/mobile
flutter test

# Backend
cd backend/api
npm run test
```

### 本地开发

参考 [README.md](README.md) 中的开发指南。

## 项目结构

```
wallpaper-universe/
├── apps/          # 应用程序
├── backend/       # 后端服务
├── packages/      # 共享包
├── docs/          # 文档
└── .github/       # GitHub 配置
```

## 提交检查清单

在提交 PR 前，请确保：

- [ ] 代码遵循项目的代码规范
- [ ] 所有测试通过
- [ ] 添加了必要的文档
- [ ] 提交信息清晰明确
- [ ] PR 描述详细完整
- [ ] 关联了相关 Issue（如果有）

## 获取帮助

如果你有任何疑问：

- 查看 [文档](docs/)
- 查看已有的 [Issues](https://github.com/zhaibin/wallpaper-universe/issues)
- 在 [Discussions](https://github.com/zhaibin/wallpaper-universe/discussions) 中提问

## 许可证

贡献的代码将采用与项目相同的 [MIT 许可证](LICENSE)。

---

再次感谢你的贡献！🎉

