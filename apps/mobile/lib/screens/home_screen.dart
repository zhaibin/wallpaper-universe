import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../providers/wallpaper_provider.dart';
import '../widgets/wallpaper_card.dart';
import 'wallpaper_detail_screen.dart';
import 'favorites_screen.dart';
import 'settings_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AnyWallpaper'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const FavoritesScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SettingsScreen()),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          _buildCategoryFilter(),
          Expanded(child: _buildWallpaperGrid()),
        ],
      ),
    );
  }

  Widget _buildCategoryFilter() {
    return Consumer<WallpaperProvider>(
      builder: (context, provider, child) {
        final categories = ['all', 'nature', 'abstract', 'minimal', 'dark', 'colorful'];
        final categoryNames = {
          'all': '全部',
          'nature': '自然',
          'abstract': '抽象',
          'minimal': '简约',
          'dark': '暗色',
          'colorful': '彩色',
        };

        return SizedBox(
          height: 50,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              final isSelected = provider.selectedCategory == category;
              
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: FilterChip(
                  label: Text(categoryNames[category] ?? category),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) {
                      provider.setCategory(category);
                    }
                  },
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildWallpaperGrid() {
    return Consumer<WallpaperProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (provider.error != null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(provider.error!),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: provider.refresh,
                  child: const Text('重试'),
                ),
              ],
            ),
          );
        }

        if (provider.wallpapers.isEmpty) {
          return const Center(child: Text('暂无壁纸'));
        }

        return RefreshIndicator(
          onRefresh: provider.refresh,
          child: MasonryGridView.count(
            crossAxisCount: 2,
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            padding: const EdgeInsets.all(8),
            itemCount: provider.wallpapers.length,
            itemBuilder: (context, index) {
              final wallpaper = provider.wallpapers[index];
              return WallpaperCard(
                wallpaper: wallpaper,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => WallpaperDetailScreen(wallpaper: wallpaper),
                    ),
                  );
                },
              );
            },
          ),
        );
      },
    );
  }
}

