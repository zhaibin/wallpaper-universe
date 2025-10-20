import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class QueueItem {
  final String id;
  final String url;
  final String title;
  final String type; // image | video
  final int durationSec;

  QueueItem({
    required this.id,
    required this.url,
    required this.title,
    required this.type,
    required this.durationSec,
  });

  factory QueueItem.fromJson(Map<String, dynamic> json) {
    return QueueItem(
      id: json['id'] ?? json['url'] ?? '',
      url: json['url'] ?? '',
      title: json['title'] ?? 'Queue Item',
      type: json['type'] ?? 'image',
      durationSec: (json['durationSec'] ?? 60) as int,
    );
  }
}

class QueueService {
  static const String apiBase = 'https://api.anywallpaper.net';

  static Future<String> _getDeviceId() async {
    final prefs = await SharedPreferences.getInstance();
    var id = prefs.getString('device_id');
    id ??= DateTime.now().millisecondsSinceEpoch.toString();
    await prefs.setString('device_id', id);
    return id;
  }

  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Future<List<QueueItem>> fetchQueue() async {
    final deviceId = await _getDeviceId();
    final token = await _getToken();
    final uri = Uri.parse('$apiBase/v1/queue');
    final res = await http.get(
      uri,
      headers: {
        if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
        'X-Client-Id': deviceId,
      },
    );
    if (res.statusCode != 200) return [];
    final data = jsonDecode(res.body);
    final list = (data['items'] ?? data['queue'] ?? []) as List;
    return list.map((e) => QueueItem.fromJson(e is Map ? e : { 'url': e })).toList();
  }
}


