// Web 应用国际化配置

export type Locale = 'en' | 'zh' | 'es' | 'fr' | 'pt' | 'ja';

export const locales: Locale[] = ['en', 'zh', 'es', 'fr', 'pt', 'ja'];

export const translations = {
  en: {
    // 通用
    home: 'Home',
    explore: 'Explore',
    upload: 'Upload',
    download: 'Download App',
    about: 'About',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    
    // 首页
    hero_title: 'Curated HD Wallpapers',
    hero_subtitle: 'Discover and download beautiful HD wallpapers for iOS, Android, Windows, macOS and more',
    browse_wallpapers: 'Browse Wallpapers',
    
    // 上传
    upload_title: 'Upload Wallpaper',
    upload_subtitle: 'Upload your wallpaper, AI will automatically analyze and generate description, tags and colors',
    select_file: 'Select File',
    title_optional: 'Title (Optional)',
    category_optional: 'Category (Optional)',
    uploading: 'Uploading... (AI analyzing)',
    upload_success: 'Upload Successful!',
    upload_failed: 'Upload Failed',
    
    // 认证
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirm_password: 'Confirm Password',
    forgot_password: 'Forgot Password?',
    no_account: "Don't have an account?",
    have_account: 'Already have an account?',
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    
    // 个人中心
    my_favorites: 'My Favorites',
    my_uploads: 'My Uploads',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    
    // 分类
    all: 'All',
    nature: 'Nature',
    abstract: 'Abstract',
    minimal: 'Minimal',
    dark: 'Dark',
    colorful: 'Colorful',
    urban: 'Urban',
    space: 'Space',
    anime: 'Anime',
    animals: 'Animals',
  },
  
  zh: {
    // 通用
    home: '首页',
    explore: '探索',
    upload: '上传',
    download: '下载应用',
    about: '关于',
    login: '登录',
    register: '注册',
    logout: '退出',
    profile: '个人中心',
    
    // 首页
    hero_title: '精选高清壁纸',
    hero_subtitle: '发现和下载精美的高清壁纸，支持 iOS、Android、Windows、macOS 等多平台',
    browse_wallpapers: '浏览壁纸',
    
    // 上传
    upload_title: '上传壁纸',
    upload_subtitle: '上传您的壁纸，AI 将自动分析并生成描述、标签和颜色信息',
    select_file: '选择文件',
    title_optional: '标题（可选）',
    category_optional: '分类（可选）',
    uploading: '上传中...（AI 正在分析）',
    upload_success: '上传成功！',
    upload_failed: '上传失败',
    
    // 认证
    username: '用户名',
    email: '邮箱',
    password: '密码',
    confirm_password: '确认密码',
    forgot_password: '忘记密码？',
    no_account: '还没有账号？',
    have_account: '已有账号？',
    sign_in: '登录',
    sign_up: '注册',
    
    // 个人中心
    my_favorites: '我的收藏',
    my_uploads: '我的上传',
    settings: '设置',
    language: '语言',
    theme: '主题',
    
    // 分类
    all: '全部',
    nature: '自然',
    abstract: '抽象',
    minimal: '简约',
    dark: '暗色',
    colorful: '彩色',
    urban: '城市',
    space: '太空',
    anime: '动漫',
    animals: '动物',
  },
  
  es: {
    home: 'Inicio',
    explore: 'Explorar',
    upload: 'Subir',
    download: 'Descargar App',
    about: 'Acerca de',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    profile: 'Perfil',
    hero_title: 'Fondos de Pantalla HD Seleccionados',
    hero_subtitle: 'Descubre y descarga hermosos fondos de pantalla HD',
    browse_wallpapers: 'Ver Fondos',
    upload_title: 'Subir Fondo',
    select_file: 'Seleccionar Archivo',
    uploading: 'Subiendo... (IA analizando)',
    all: 'Todos',
    nature: 'Naturaleza',
    abstract: 'Abstracto',
    minimal: 'Minimalista',
    dark: 'Oscuro',
    colorful: 'Colorido',
  },
  
  fr: {
    home: 'Accueil',
    explore: 'Explorer',
    upload: 'Télécharger',
    download: 'Télécharger App',
    about: 'À propos',
    login: 'Se connecter',
    register: "S'inscrire",
    logout: 'Se déconnecter',
    profile: 'Profil',
    hero_title: 'Fonds d\'écran HD Sélectionnés',
    hero_subtitle: 'Découvrez et téléchargez de beaux fonds d\'écran HD',
    browse_wallpapers: 'Parcourir',
    all: 'Tous',
    nature: 'Nature',
    abstract: 'Abstrait',
    minimal: 'Minimaliste',
    dark: 'Sombre',
    colorful: 'Coloré',
  },
  
  pt: {
    home: 'Início',
    explore: 'Explorar',
    upload: 'Enviar',
    download: 'Baixar App',
    about: 'Sobre',
    login: 'Entrar',
    register: 'Registrar',
    logout: 'Sair',
    profile: 'Perfil',
    hero_title: 'Papéis de Parede HD Selecionados',
    hero_subtitle: 'Descubra e baixe belos papéis de parede HD',
    browse_wallpapers: 'Navegar',
    all: 'Todos',
    nature: 'Natureza',
    abstract: 'Abstrato',
    minimal: 'Minimalista',
    dark: 'Escuro',
    colorful: 'Colorido',
  },
  
  ja: {
    home: 'ホーム',
    explore: '探索',
    upload: 'アップロード',
    download: 'アプリをダウンロード',
    about: '概要',
    login: 'ログイン',
    register: '登録',
    logout: 'ログアウト',
    profile: 'プロフィール',
    hero_title: '厳選HD壁紙',
    hero_subtitle: '美しいHD壁紙を発見してダウンロード',
    browse_wallpapers: '壁紙を見る',
    all: 'すべて',
    nature: '自然',
    abstract: '抽象',
    minimal: 'ミニマル',
    dark: 'ダーク',
    colorful: 'カラフル',
  },
};

export function getTranslation(locale: Locale, key: string): string {
  const localeTranslations = translations[locale] || translations.en;
  const translationKey = key as keyof typeof translations.en;
  return (localeTranslations as any)[translationKey] || (translations.en as any)[translationKey] || key;
}

