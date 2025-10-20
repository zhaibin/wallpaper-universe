'use client'

import { useState } from 'react'
import useSWR from 'swr'
import WallpaperGrid from './components/WallpaperGrid'
import CategoryFilter from './components/CategoryFilter'
import Hero from './components/Hero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AnyWallpaper - 精选高清壁纸',
  description: '发现和下载精美的高清壁纸，支持多端设置与轮播。AI 智能分析，多语言支持，跨设备同步。',
  keywords: ['壁纸', '高清壁纸', 'wallpaper', '桌面壁纸', '手机壁纸', 'AI分析', '多端同步'],
  alternates: {
    canonical: 'https://www.anywallpaper.net',
  },
  openGraph: {
    title: 'AnyWallpaper - 精选高清壁纸',
    description: '发现和下载精美的高清壁纸，支持多端设置与轮播',
    type: 'website',
    url: 'https://www.anywallpaper.net',
    siteName: 'AnyWallpaper',
    images: [
      {
        url: 'https://www.anywallpaper.net/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AnyWallpaper - 精选高清壁纸',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnyWallpaper - 精选高清壁纸',
    description: '发现和下载精美的高清壁纸，支持多端设置与轮播',
    images: ['https://www.anywallpaper.net/og-image.jpg'],
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

export default function Page() {
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
          title: '演示壁纸 1',
          url: 'https://picsum.photos/1920/1080',
          thumbnail: 'https://picsum.photos/400/300',
          category: 'nature',
        },
        {
          id: '2',
          title: '演示壁纸 2',
          url: 'https://picsum.photos/1920/1080?random=2',
          thumbnail: 'https://picsum.photos/400/300?random=2',
          category: 'abstract',
        },
        {
          id: '3',
          title: '演示壁纸 3',
          url: 'https://picsum.photos/1920/1080?random=3',
          thumbnail: 'https://picsum.photos/400/300?random=3',
          category: 'minimal',
        },
      ],
    }
  )

  return (
    <>
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
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
    </>
  )
}
