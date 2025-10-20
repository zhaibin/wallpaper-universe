// 国际化支持

export type SupportedLocale = 'en' | 'zh' | 'es' | 'fr' | 'pt' | 'ja';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'zh', 'es', 'fr', 'pt', 'ja'];

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  zh: '简体中文',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  ja: '日本語',
};

// 一级分类多语言翻译
export const CATEGORY_TRANSLATIONS: Record<string, Record<SupportedLocale, string>> = {
  all: {
    en: 'All',
    zh: '全部',
    es: 'Todos',
    fr: 'Tous',
    pt: 'Todos',
    ja: 'すべて',
  },
  nature: {
    en: 'Nature',
    zh: '自然',
    es: 'Naturaleza',
    fr: 'Nature',
    pt: 'Natureza',
    ja: '自然',
  },
  abstract: {
    en: 'Abstract',
    zh: '抽象',
    es: 'Abstracto',
    fr: 'Abstrait',
    pt: 'Abstrato',
    ja: '抽象',
  },
  minimal: {
    en: 'Minimal',
    zh: '简约',
    es: 'Minimalista',
    fr: 'Minimaliste',
    pt: 'Minimalista',
    ja: 'ミニマル',
  },
  dark: {
    en: 'Dark',
    zh: '暗色',
    es: 'Oscuro',
    fr: 'Sombre',
    pt: 'Escuro',
    ja: 'ダーク',
  },
  colorful: {
    en: 'Colorful',
    zh: '彩色',
    es: 'Colorido',
    fr: 'Coloré',
    pt: 'Colorido',
    ja: 'カラフル',
  },
  urban: {
    en: 'Urban',
    zh: '城市',
    es: 'Urbano',
    fr: 'Urbain',
    pt: 'Urbano',
    ja: '都市',
  },
  space: {
    en: 'Space',
    zh: '太空',
    es: 'Espacio',
    fr: 'Espace',
    pt: 'Espaço',
    ja: '宇宙',
  },
  anime: {
    en: 'Anime',
    zh: '动漫',
    es: 'Anime',
    fr: 'Anime',
    pt: 'Anime',
    ja: 'アニメ',
  },
  animals: {
    en: 'Animals',
    zh: '动物',
    es: 'Animales',
    fr: 'Animaux',
    pt: 'Animais',
    ja: '動物',
  },
};

// AI 分析提示词（多语言）
export function getAIPrompt(locale: SupportedLocale): string {
  const prompts: Record<SupportedLocale, string> = {
    en: `Analyze this wallpaper image and output the following information in JSON format:
1. description: A 50-word description of the wallpaper content and features
2. tags: Provide three-level tags (level 1: 2-3 tags, level 2: 3-5 tags, level 3: 5-8 tags), each with level(1/2/3), name(in English), weight(0-1)
3. colors: Extract 3-5 main colors, each with hex, rgb([r,g,b]), percentage, name(in English)
4. detectedObjects: Main objects/elements detected (array, in English)
5. mood: Overall mood/atmosphere (in English)
6. style: Art style (in English)
7. level1TagsTranslations: Translate level 1 tags to zh, es, fr, pt, ja

Requirements:
- Tags should be specific, not too broad (avoid "nature", use "mountains", "forest")
- Colors should be accurate for clustering
- Tags organized by levels: L1(general) → L2(medium) → L3(specific)
- Only level 1 tags need multilingual translations

Return JSON only, no other text.`,

    zh: `分析这张壁纸图片，输出以下信息（JSON格式）：
1. description: 用50字描述壁纸的内容和特点
2. tags: 三级标签（一级2-3个，二级3-5个，三级5-8个），每个包含 level(1/2/3), name(英文), weight(0-1)
3. colors: 提取3-5个主要颜色，每个包含 hex, rgb([r,g,b]), percentage, name(英文)
4. detectedObjects: 检测到的主要物体（数组，英文）
5. mood: 情绪/氛围（英文）
6. style: 艺术风格（英文）
7. level1TagsTranslations: 将一级标签翻译成 zh, es, fr, pt, ja

要求：
- 标签要具体（避免"nature"，用"mountains"、"forest"等）
- 颜色准确，用于聚类
- 仅一级标签需要多语言翻译
- 其他保持英文

只返回JSON对象。`,

    es: `Analiza esta imagen de fondo de pantalla y proporciona la siguiente información en formato JSON:
1. description: Una descripción de 50 palabras del contenido
2. tags: Etiquetas de tres niveles (nivel 1: 2-3, nivel 2: 3-5, nivel 3: 5-8), cada una con level(1/2/3), name(en inglés), weight(0-1)
3. colors: 3-5 colores principales con hex, rgb, percentage, name(en inglés)
4. detectedObjects: Objetos detectados (array, en inglés)
5. mood: Estado de ánimo (en inglés)
6. style: Estilo artístico (en inglés)
7. level1TagsTranslations: Traduce etiquetas de nivel 1 a zh, es, fr, pt, ja

Solo JSON, sin otro texto.`,

    fr: `Analysez cette image de fond d'écran et fournissez les informations suivantes au format JSON:
1. description: Une description de 50 mots du contenu
2. tags: Balises à trois niveaux (niveau 1: 2-3, niveau 2: 3-5, niveau 3: 5-8), chacune avec level(1/2/3), name(en anglais), weight(0-1)
3. colors: 3-5 couleurs principales avec hex, rgb, percentage, name(en anglais)
4. detectedObjects: Objets détectés (array, en anglais)
5. mood: Ambiance (en anglais)
6. style: Style artistique (en anglais)
7. level1TagsTranslations: Traduisez les balises de niveau 1 en zh, es, fr, pt, ja

JSON uniquement, pas d'autre texte.`,

    pt: `Analise esta imagem de papel de parede e forneça as seguintes informações em formato JSON:
1. description: Uma descrição de 50 palavras do conteúdo
2. tags: Tags de três níveis (nível 1: 2-3, nível 2: 3-5, nível 3: 5-8), cada uma com level(1/2/3), name(em inglês), weight(0-1)
3. colors: 3-5 cores principais com hex, rgb, percentage, name(em inglês)
4. detectedObjects: Objetos detectados (array, em inglês)
5. mood: Humor (em inglês)
6. style: Estilo artístico (em inglês)
7. level1TagsTranslations: Traduza tags de nível 1 para zh, es, fr, pt, ja

Apenas JSON, sem outro texto.`,

    ja: `この壁紙画像を分析し、以下の情報をJSON形式で出力してください：
1. description: 50文字程度の説明
2. tags: 3段階タグ（レベル1: 2-3個、レベル2: 3-5個、レベル3: 5-8個）、各々level(1/2/3), name(英語), weight(0-1)
3. colors: 主要な3-5色、各々hex, rgb, percentage, name(英語)
4. detectedObjects: 検出されたオブジェクト（配列、英語）
5. mood: 雰囲気（英語）
6. style: アートスタイル（英語）
7. level1TagsTranslations: レベル1タグを zh, es, fr, pt, ja に翻訳

JSONのみ、他のテキストなし。`,
  };

  return prompts[locale] || prompts.en;
}

// 获取用户偏好语言
export function getUserLocale(request: Request): SupportedLocale {
  // 从 Accept-Language header 获取
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  const primaryLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();

  if (SUPPORTED_LOCALES.includes(primaryLang as SupportedLocale)) {
    return primaryLang as SupportedLocale;
  }

  return 'en'; // 默认英语
}

