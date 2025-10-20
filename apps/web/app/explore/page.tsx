'use client'

import { useState } from 'react'
import useSWR from 'swr'
import WallpaperGrid from '../components/WallpaperGrid'
import CategoryFilter from '../components/CategoryFilter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '探索壁纸 - AnyWallpaper',
  description: '探索精选高清壁纸，按分类浏览自然、抽象、简约、暗色、彩色等主题壁纸。AI 智能分析，多语言支持。',
  keywords: ['壁纸探索', '分类壁纸', '自然壁纸', '抽象壁纸', '简约壁纸', '暗色壁纸', '彩色壁纸'],
  alternates: {
    canonical: 'https://www.anywallpaper.net/explore',
  },
  openGraph: {
    title: '探索壁纸 - AnyWallpaper',
    description: '探索精选高清壁纸，按分类浏览各种主题壁纸',
    type: 'website',
    url: 'https://www.anywallpaper.net/explore',
    siteName: 'AnyWallpaper',
    images: [
      {
        url: 'https://www.anywallpaper.net/og-explore.jpg',
        width: 1200,
        height: 630,
        alt: '探索壁纸 - AnyWallpaper',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '探索壁纸 - AnyWallpaper',
    description: '探索精选高清壁纸，按分类浏览各种主题壁纸',
    images: ['https://www.anywallpaper.net/og-explore.jpg'],
  },
}

interface Wallpaper {
  id: string
  title: string
  url: string
  thumbnail?: string
  category?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const { data: wallpapers, error, isLoading } = useSWR<Wallpaper[]>(
    selectedCategory === 'all' 
      ? 'https://api.anywallpaper.net/v1/wallpapers'
      : `https://api.anywallpaper.net/v1/wallpapers?category=${selectedCategory}`,
    fetcher,
    {
      fallbackData: [
        {
          id: '1',
          title: '自然风光 1',
          url: 'https://picsum.photos/1920/1080',
          thumbnail: 'https://picsum.photos/400/300',
          category: 'nature',
        },
        {
          id: '2',
          title: '抽象艺术',
          url: 'https://picsum.photos/1920/1080?random=2',
          thumbnail: 'https://picsum.photos/400/300?random=2',
          category: 'abstract',
        },
        {
          id: '3',
          title: '简约设计',
          url: 'https://picsum.photos/1920/1080?random=3',
          thumbnail: 'https://picsum.photos/400/300?random=3',
          category: 'minimal',
        },
        {
          id: '4',
          title: '暗色主题',
          url: 'https://picsum.photos/1920/1080?random=4',
          thumbnail: 'https://picsum.photos/400/300?random=4',
          category: 'dark',
        },
        {
          id: '5',
          title: '彩色世界',
          url: 'https://picsum.photos/1920/1080?random=5',
          thumbnail: 'https://picsum.photos/400/300?random=5',
          category: 'colorful',
        },
      ],
    }
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">探索壁纸</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          发现各种主题的精选高清壁纸
        </p>
      </div>
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-20 text-red-500">
          加载失败，请稍后重试
        </div>
      )}
      
      {wallpapers && <WallpaperGrid wallpapers={wallpapers} />}
    </div>
  )
}
