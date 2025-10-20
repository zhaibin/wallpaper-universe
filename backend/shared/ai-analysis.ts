// Workers AI 图像分析

import type { AIAnalysisResult, WallpaperTag, ColorInfo } from './types';
import { getAIPrompt, type SupportedLocale } from './i18n';

export async function analyzeImage(
  ai: any,
  imageData: ArrayBuffer,
  locale: SupportedLocale = 'en'
): Promise<AIAnalysisResult> {
  try {
    // 使用对应语言的提示词
    const prompt = getAIPrompt(locale);
    const response = await ai.run('@cf/meta/llama-3.2-11b-vision-instruct', {
      image: Array.from(new Uint8Array(imageData)),
      prompt: prompt,
      max_tokens: 1024,
    });

    // 解析 AI 响应
    const aiResult = parseAIResponse(response.response);
    
    return {
      description: aiResult.description || '精美壁纸',
      tags: aiResult.tags || generateDefaultTags(),
      colors: aiResult.colors || generateDefaultColors(),
      detectedObjects: aiResult.detectedObjects || [],
      mood: aiResult.mood || '未知',
      style: aiResult.style || '未知',
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    
    // 返回默认分析结果
    return {
      description: '精美壁纸，等待进一步分析',
      tags: generateDefaultTags(),
      colors: generateDefaultColors(),
      analyzedAt: new Date().toISOString(),
    };
  }
}

function parseAIResponse(response: string): any {
  try {
    // 尝试从响应中提取 JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {};
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {};
  }
}

function generateDefaultTags(): WallpaperTag[] {
  return [
    { level: 1, name: '自然', weight: 0.8 },
    { level: 2, name: '风景', weight: 0.7 },
    { level: 3, name: '通用壁纸', weight: 0.6 },
  ];
}

function generateDefaultColors(): ColorInfo[] {
  return [
    {
      hex: '#5B7C99',
      rgb: [91, 124, 153],
      percentage: 35,
      name: '蓝灰色',
    },
    {
      hex: '#8FA9B8',
      rgb: [143, 169, 184],
      percentage: 25,
      name: '浅蓝色',
    },
    {
      hex: '#D4E4ED',
      rgb: [212, 228, 237],
      percentage: 20,
      name: '淡蓝色',
    },
  ];
}

// 颜色提取（备用方案）
export function extractColors(imageData: Uint8Array): ColorInfo[] {
  // 简化版颜色提取
  // 在实际应用中，可以使用更复杂的算法如 k-means 聚类
  const colors: Map<string, number> = new Map();
  
  // 采样像素（每10个像素采样一次）
  for (let i = 0; i < imageData.length; i += 40) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    
    // 将颜色分组（减少颜色数量）
    const rGroup = Math.floor(r / 32) * 32;
    const gGroup = Math.floor(g / 32) * 32;
    const bGroup = Math.floor(b / 32) * 32;
    
    const colorKey = `${rGroup},${gGroup},${bGroup}`;
    colors.set(colorKey, (colors.get(colorKey) || 0) + 1);
  }
  
  // 获取前5个最常见的颜色
  const sortedColors = Array.from(colors.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const totalPixels = sortedColors.reduce((sum, [, count]) => sum + count, 0);
  
  return sortedColors.map(([color, count]) => {
    const [r, g, b] = color.split(',').map(Number);
    return {
      hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
      rgb: [r, g, b] as [number, number, number],
      percentage: Math.round((count / totalPixels) * 100),
      name: getColorName([r, g, b]),
    };
  });
}

function getColorName(rgb: [number, number, number]): string {
  const [r, g, b] = rgb;
  
  // 简单的颜色命名逻辑
  if (r > 200 && g > 200 && b > 200) return '白色';
  if (r < 50 && g < 50 && b < 50) return '黑色';
  
  const max = Math.max(r, g, b);
  if (max === r) {
    if (g > 100) return '橙色';
    return '红色';
  }
  if (max === g) return '绿色';
  if (max === b) {
    if (r > 100) return '紫色';
    return '蓝色';
  }
  
  return '混合色';
}

