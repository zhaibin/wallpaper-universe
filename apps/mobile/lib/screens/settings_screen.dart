import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';
import '../providers/wallpaper_provider.dart';
import 'login_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('设置'),
      ),
      body: ListView(
        children: [
          const SizedBox(height: 16),
          _buildThemeSection(context),
          const Divider(height: 32),
          _buildSlideshowSection(context),
          const Divider(height: 32),
        _buildAccountSection(context),
        const Divider(height: 32),
          _buildAboutSection(context),
        ],
      ),
    );
  }

  Widget _buildAccountSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            '账号',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
        ),
        const SizedBox(height: 8),
        ListTile(
          leading: const Icon(Icons.login),
          title: const Text('登录'),
          subtitle: const Text('登录后可同步轮播队列'),
          onTap: () async {
            await Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const LoginScreen()),
            );
          },
        ),
      ],
    );
  }

  Widget _buildThemeSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            '外观',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Consumer<ThemeProvider>(
          builder: (context, provider, child) {
            return Column(
              children: [
                RadioListTile<ThemeMode>(
                  title: const Text('跟随系统'),
                  value: ThemeMode.system,
                  groupValue: provider.themeMode,
                  onChanged: (mode) {
                    if (mode != null) provider.setThemeMode(mode);
                  },
                ),
                RadioListTile<ThemeMode>(
                  title: const Text('浅色模式'),
                  value: ThemeMode.light,
                  groupValue: provider.themeMode,
                  onChanged: (mode) {
                    if (mode != null) provider.setThemeMode(mode);
                  },
                ),
                RadioListTile<ThemeMode>(
                  title: const Text('深色模式'),
                  value: ThemeMode.dark,
                  groupValue: provider.themeMode,
                  onChanged: (mode) {
                    if (mode != null) provider.setThemeMode(mode);
                  },
                ),
              ],
            );
          },
        ),
      ],
    );
  }

  Widget _buildSlideshowSection(BuildContext context) {
    final wall = context.watch<WallpaperProvider>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            '轮播',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
        ),
        const SizedBox(height: 8),
        SwitchListTile(
          title: const Text('启用轮播'),
          value: wall.slideshowEnabled,
          onChanged: wall.setSlideshowEnabled,
        ),
        ListTile(
          title: const Text('轮播间隔（秒）'),
          subtitle: Text('${wall.slideDurationSec} 秒'),
          trailing: SizedBox(
            width: 100,
            child: TextField(
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(hintText: '60'),
              onSubmitted: (v) {
                final n = int.tryParse(v) ?? 60;
                wall.setSlideDurationSec(n);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAboutSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            '关于',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
        ),
        const SizedBox(height: 8),
        ListTile(
          leading: const Icon(Icons.info_outline),
          title: const Text('版本'),
          subtitle: const Text('0.1.0'),
        ),
        ListTile(
          leading: const Icon(Icons.description_outlined),
          title: const Text('许可证'),
          subtitle: const Text('MIT License'),
        ),
        ListTile(
          leading: const Icon(Icons.code),
          title: const Text('开源仓库'),
          subtitle: const Text('github.com/anywallpaper/wallpaper-universe'),
          onTap: () {
            // TODO: 打开链接
          },
        ),
      ],
    );
  }
}

