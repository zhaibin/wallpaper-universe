'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface Wallpaper {
  id: string
  title: string
  url: string
  thumbnail?: string
  category?: string
}

interface WallpaperGridProps {
  wallpapers: Wallpaper[]
}

export default function WallpaperGrid({ wallpapers }: WallpaperGridProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wallpapers.map((wallpaper, index) => (
          <motion.div
            key={wallpaper.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition"
            onClick={() => setSelectedWallpaper(wallpaper)}
          >
            <Image
              src={wallpaper.thumbnail || wallpaper.url}
              alt={wallpaper.title}
              fill
              className="object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg mb-1">{wallpaper.title}</h3>
                {wallpaper.category && (
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                    {wallpaper.category}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {selectedWallpaper && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedWallpaper(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={selectedWallpaper.url}
                alt={selectedWallpaper.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <h2 className="text-white text-2xl font-bold mb-2">{selectedWallpaper.title}</h2>
                {selectedWallpaper.category && (
                  <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
                    {selectedWallpaper.category}
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                <a
                  href={selectedWallpaper.url}
                  download
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold hover:shadow-xl transition"
                >
                  下载
                </a>
                <button
                  onClick={() => setSelectedWallpaper(null)}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition"
                >
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

