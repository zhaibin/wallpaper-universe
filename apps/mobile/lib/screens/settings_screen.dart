import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';

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
          _buildAboutSection(context),
        ],
      ),
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

