import 'package:flutter/foundation.dart';
import '../models/wallpaper.dart';
import '../services/api_service.dart';

class WallpaperProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Wallpaper> _wallpapers = [];
  List<Wallpaper> _favorites = [];
  bool _isLoading = false;
  String? _error;
  String _selectedCategory = 'all';

  List<Wallpaper> get wallpapers => _wallpapers;
  List<Wallpaper> get favorites => _favorites;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get selectedCategory => _selectedCategory;

  WallpaperProvider() {
    loadWallpapers();
  }

  Future<void> loadWallpapers() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _wallpapers = await _apiService.fetchWallpapers(_selectedCategory);
      _error = null;
    } catch (e) {
      _error = '加载壁纸失败: $e';
      debugPrint(_error);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> setCategory(String category) async {
    if (_selectedCategory == category) return;
    _selectedCategory = category;
    await loadWallpapers();
  }

  Future<void> toggleFavorite(Wallpaper wallpaper) async {
    final index = _wallpapers.indexWhere((w) => w.id == wallpaper.id);
    if (index != -1) {
      _wallpapers[index] = wallpaper.copyWith(isFavorite: !wallpaper.isFavorite);
      
      if (_wallpapers[index].isFavorite) {
        _favorites.add(_wallpapers[index]);
      } else {
        _favorites.removeWhere((w) => w.id == wallpaper.id);
      }
      
      notifyListeners();
    }
  }

  Future<void> refresh() async {
    await loadWallpapers();
  }
}

