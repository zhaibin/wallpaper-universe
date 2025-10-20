class Wallpaper {
  final String id;
  final String title;
  final String url;
  final String? thumbnail;
  final String? category;
  final int? width;
  final int? height;
  final String? author;
  final List<String>? tags;
  final bool isFavorite;

  Wallpaper({
    required this.id,
    required this.title,
    required this.url,
    this.thumbnail,
    this.category,
    this.width,
    this.height,
    this.author,
    this.tags,
    this.isFavorite = false,
  });

  factory Wallpaper.fromJson(Map<String, dynamic> json) {
    return Wallpaper(
      id: json['id'] as String,
      title: json['title'] as String,
      url: json['url'] as String,
      thumbnail: json['thumbnail'] as String?,
      category: json['category'] as String?,
      width: json['width'] as int?,
      height: json['height'] as int?,
      author: json['author'] as String?,
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList(),
      isFavorite: json['isFavorite'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'url': url,
      'thumbnail': thumbnail,
      'category': category,
      'width': width,
      'height': height,
      'author': author,
      'tags': tags,
      'isFavorite': isFavorite,
    };
  }

  Wallpaper copyWith({
    String? id,
    String? title,
    String? url,
    String? thumbnail,
    String? category,
    int? width,
    int? height,
    String? author,
    List<String>? tags,
    bool? isFavorite,
  }) {
    return Wallpaper(
      id: id ?? this.id,
      title: title ?? this.title,
      url: url ?? this.url,
      thumbnail: thumbnail ?? this.thumbnail,
      category: category ?? this.category,
      width: width ?? this.width,
      height: height ?? this.height,
      author: author ?? this.author,
      tags: tags ?? this.tags,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}

