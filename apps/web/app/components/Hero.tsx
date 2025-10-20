'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary-dark/10 to-purple-500/10 dark:from-primary/20 dark:via-primary-dark/20 dark:to-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              精选高清壁纸
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            发现和下载精美的高清壁纸，支持 iOS、Android、Windows、macOS 等多平台
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#wallpapers"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
            >
              浏览壁纸
            </motion.a>
            <motion.a
              href="/download"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
            >
              下载应用
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-dark/20 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  )
}

