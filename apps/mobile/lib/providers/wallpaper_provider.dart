import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/wallpaper.dart';
import '../services/api_service.dart';
import '../services/queue_service.dart';

class WallpaperProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Wallpaper> _wallpapers = [];
  List<Wallpaper> _favorites = [];
  bool _isLoading = false;
  String? _error;
  String _selectedCategory = 'all';

  // 轮播相关
  bool _slideshowEnabled = true;
  int _slideDurationSec = 60;
  List<QueueItem> _queue = [];
  int _currentIndex = 0;

  List<Wallpaper> get wallpapers => _wallpapers;
  List<Wallpaper> get favorites => _favorites;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get selectedCategory => _selectedCategory;
  bool get slideshowEnabled => _slideshowEnabled;
  int get slideDurationSec => _slideDurationSec;
  List<QueueItem> get queue => _queue;
  int get currentIndex => _currentIndex;

  WallpaperProvider() {
    loadWallpapers();
    loadPrefs();
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

  Future<void> loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    _slideshowEnabled = prefs.getBool('slideshow_enabled') ?? true;
    _slideDurationSec = prefs.getInt('slide_duration_sec') ?? 60;
    notifyListeners();
  }

  Future<void> savePrefs() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('slideshow_enabled', _slideshowEnabled);
    await prefs.setInt('slide_duration_sec', _slideDurationSec);
  }

  void setSlideshowEnabled(bool enabled) {
    _slideshowEnabled = enabled;
    savePrefs();
    notifyListeners();
  }

  void setSlideDurationSec(int sec) {
    _slideDurationSec = sec.clamp(10, 3600);
    savePrefs();
    notifyListeners();
  }

  Future<void> refreshQueue() async {
    _queue = await QueueService.fetchQueue();
    if (_queue.isNotEmpty && _currentIndex >= _queue.length) {
      _currentIndex = 0;
    }
    notifyListeners();
  }

  QueueItem? get currentItem =>
      _queue.isEmpty ? null : _queue[_currentIndex % _queue.length];

  void nextItem() {
    if (_queue.isEmpty) return;
    _currentIndex = (_currentIndex + 1) % _queue.length;
    notifyListeners();
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

