// 设备检测工具

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // 检查 User Agent
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // 移动设备正则
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  // 检查触摸支持和屏幕宽度
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  
  return mobileRegex.test(userAgent) || (hasTouchScreen && isSmallScreen);
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

