import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_wallpaper_manager/flutter_wallpaper_manager.dart';
import 'package:image_gallery_saver/image_gallery_saver.dart';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import '../models/wallpaper.dart';
import '../providers/wallpaper_provider.dart';

class WallpaperDetailScreen extends StatelessWidget {
  final Wallpaper wallpaper;

  const WallpaperDetailScreen({super.key, required this.wallpaper});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Consumer<WallpaperProvider>(
            builder: (context, provider, child) {
              final isFavorite = wallpaper.isFavorite;
              return IconButton(
                icon: Icon(
                  isFavorite ? Icons.favorite : Icons.favorite_border,
                  color: Colors.white,
                ),
                onPressed: () {
                  provider.toggleFavorite(wallpaper);
                },
              );
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          Hero(
            tag: 'wallpaper_${wallpaper.id}',
            child: CachedNetworkImage(
              imageUrl: wallpaper.url,
              fit: BoxFit.cover,
              width: double.infinity,
              height: double.infinity,
              placeholder: (context, url) => const Center(
                child: CircularProgressIndicator(),
              ),
              errorWidget: (context, url, error) => const Icon(Icons.error),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    Colors.black.withOpacity(0.8),
                    Colors.transparent,
                  ],
                ),
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    wallpaper.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (wallpaper.author != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      '作者: ${wallpaper.author}',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 14,
                      ),
                    ),
                  ],
                  const SizedBox(height: 24),
                  Column(
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () => _setAsWallpaper(context),
                              icon: const Icon(Icons.wallpaper),
                              label: const Text('设为壁纸'),
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () => _downloadWallpaper(context),
                              icon: const Icon(Icons.download),
                              label: const Text('下载'),
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Consumer<WallpaperProvider>(
                        builder: (context, provider, child) {
                          final currentItem = provider.currentItem;
                          return SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: currentItem != null 
                                ? () => _applyCurrentQueueItem(context, provider)
                                : null,
                              icon: const Icon(Icons.queue_play_next),
                              label: Text(currentItem != null 
                                ? '应用当前队列项' 
                                : '队列为空'),
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                backgroundColor: currentItem != null 
                                  ? Colors.green 
                                  : Colors.grey,
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _setAsWallpaper(BuildContext context) async {
    // Web 无法直接设置壁纸
    if (kIsWeb) {
      _showSnack(context, '请在移动设备上设置壁纸');
      return;
    }

    if (Platform.isIOS) {
      // iOS 无法直接设置，保存到相册并提示
      await _downloadWallpaper(context);
      _showSnack(context, '已保存到相册，请前往系统设置为壁纸');
      return;
    }

    if (Platform.isAndroid) {
      // 选择设置位置
      final target = await showModalBottomSheet<int>(
        context: context,
        builder: (ctx) {
          return SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  leading: const Icon(Icons.home),
                  title: const Text('主屏幕'),
                  onTap: () => Navigator.pop(ctx, WallpaperManager.HOME_SCREEN),
                ),
                ListTile(
                  leading: const Icon(Icons.lock),
                  title: const Text('锁屏'),
                  onTap: () => Navigator.pop(ctx, WallpaperManager.LOCK_SCREEN),
                ),
                ListTile(
                  leading: const Icon(Icons.smartphone),
                  title: const Text('主屏 + 锁屏'),
                  onTap: () => Navigator.pop(ctx, WallpaperManager.BOTH_SCREENS),
                ),
              ],
            ),
          );
        },
      );

      if (target == null) return;

      try {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => const Center(child: CircularProgressIndicator()),
        );

        // 下载到临时目录
        final tmpDir = await getTemporaryDirectory();
        final filePath = '${tmpDir.path}/aw_${wallpaper.id}.jpg';
        final resp = await Dio().get(
          wallpaper.url,
          options: Options(responseType: ResponseType.bytes),
        );
        final bytes = Uint8List.fromList(resp.data);
        final file = File(filePath);
        await file.writeAsBytes(bytes);

        final ok = await WallpaperManager.setWallpaperFromFile(file.path, target);

        if (context.mounted) {
          Navigator.pop(context);
          _showSnack(context, ok == true ? '壁纸设置成功！' : '设置失败');
        }
      } catch (e) {
        if (context.mounted) {
          Navigator.pop(context);
          _showSnack(context, '设置失败: $e');
        }
      }
      return;
    }

    _showSnack(context, '当前平台暂不支持直接设置壁纸');
  }

  Future<void> _downloadWallpaper(BuildContext context) async {
    try {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(child: CircularProgressIndicator()),
      );

      final response = await Dio().get(
        wallpaper.url,
        options: Options(responseType: ResponseType.bytes),
      );
      
      final result = await ImageGallerySaver.saveImage(
        Uint8List.fromList(response.data as List<int>),
        quality: 100,
        name: 'wallpaper_${wallpaper.id}',
      );
      
      if (context.mounted) {
        Navigator.pop(context);
        if (result['isSuccess']) {
          _showSnack(context, '下载成功！');
        } else {
          _showSnack(context, '下载失败');
        }
      }
    } catch (e) {
      if (context.mounted) {
        Navigator.pop(context);
        _showSnack(context, '下载失败: $e');
      }
    }
  }

  Future<void> _applyCurrentQueueItem(BuildContext context, WallpaperProvider provider) async {
    final currentItem = provider.currentItem;
    if (currentItem == null) {
      _showSnack(context, '队列为空');
      return;
    }

    try {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(child: CircularProgressIndicator()),
      );

      if (Platform.isAndroid) {
        // Android: 下载并设置壁纸
        final tmpDir = await getTemporaryDirectory();
        final filePath = '${tmpDir.path}/aw_queue_${currentItem.id}.jpg';
        final resp = await Dio().get(
          currentItem.url,
          options: Options(responseType: ResponseType.bytes),
        );
        final bytes = Uint8List.fromList(resp.data as List<int>);
        final file = File(filePath);
        await file.writeAsBytes(bytes);

        final ok = await WallpaperManager.setWallpaperFromFile(file.path, WallpaperManager.BOTH_SCREENS);
        
        if (context.mounted) {
          Navigator.pop(context);
          _showSnack(context, ok == true ? '队列项已设为壁纸！' : '设置失败');
        }
      } else if (Platform.isIOS) {
        // iOS: 保存到相册并提示
        final resp = await Dio().get(
          currentItem.url,
          options: Options(responseType: ResponseType.bytes),
        );
        
        final result = await ImageGallerySaver.saveImage(
          Uint8List.fromList(resp.data as List<int>),
          quality: 100,
          name: 'queue_${currentItem.id}',
        );
        
        if (context.mounted) {
          Navigator.pop(context);
          if (result['isSuccess']) {
            _showSnack(context, '已保存到相册，请前往系统设置为壁纸');
            // 可选：跳转到系统设置
            _showSettingsDialog(context);
          } else {
            _showSnack(context, '保存失败');
          }
        }
      }
    } catch (e) {
      if (context.mounted) {
        Navigator.pop(context);
        _showSnack(context, '应用失败: $e');
      }
    }
  }

  void _showSettingsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('设置壁纸'),
        content: const Text('壁纸已保存到相册，请前往系统设置 > 壁纸 > 选择新壁纸'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('知道了'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              // 这里可以尝试打开系统设置（需要 url_launcher）
              // launchUrl(Uri.parse('app-settings:'));
            },
            child: const Text('打开设置'),
          ),
        ],
      ),
    );
  }

  void _showSnack(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg)),
    );
  }
}

