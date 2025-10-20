import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/wallpaper.dart';

class ApiService {
  static const String baseUrl = 'https://api.anywallpaper.com/v1';
  
  Future<List<Wallpaper>> fetchWallpapers(String category) async {
    try {
      final url = category == 'all' 
          ? '$baseUrl/wallpapers'
          : '$baseUrl/wallpapers?category=$category';
      
      final response = await http.get(Uri.parse(url));
      
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Wallpaper.fromJson(json)).toList();
      } else {
        throw Exception('加载失败: ${response.statusCode}');
      }
    } catch (e) {
      // 返回演示数据
      return [
        Wallpaper(
          id: '1',
          title: '演示壁纸',
          url: 'https://picsum.photos/1080/1920',
          thumbnail: 'https://picsum.photos/400/600',
          category: 'nature',
        ),
        Wallpaper(
          id: '2',
          title: '演示壁纸 2',
          url: 'https://picsum.photos/1080/1920?random=2',
          thumbnail: 'https://picsum.photos/400/600?random=2',
          category: 'abstract',
        ),
      ];
    }
  }

  Future<Wallpaper> getWallpaperById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/wallpapers/$id'));
    
    if (response.statusCode == 200) {
      return Wallpaper.fromJson(json.decode(response.body));
    } else {
      throw Exception('加载壁纸详情失败');
    }
  }
}

