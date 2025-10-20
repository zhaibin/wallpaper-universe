'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { isMobileDevice } from '../lib/device'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              AnyWallpaper
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">
              首页
            </Link>
            <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">
              探索
            </Link>
            {!isMobile && (
              <Link href="/upload" className="text-gray-700 dark:text-gray-300 hover:text-primary transition flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                上传
              </Link>
            )}
            <Link href="/download" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">
              下载应用
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">
              关于
            </Link>
            <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-primary transition">
              个人中心
            </Link>
            <Link href="/auth/login" className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition">
              登录
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Link href="/" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition">
              首页
            </Link>
            <Link href="/explore" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition">
              探索
            </Link>
            {!isMobile && (
              <Link href="/upload" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition">
                上传壁纸
              </Link>
            )}
            <Link href="/download" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition">
              下载应用
            </Link>
            <Link href="/about" className="block text-gray-700 dark:text-gray-300 hover:text-primary transition">
              关于
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

