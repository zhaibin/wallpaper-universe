'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface UserProfile {
  id: string
  username: string
  email: string
  avatarUrl?: string
  locale: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch('https://api.anywallpaper.net/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">个人中心</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            退出登录
          </button>
        </div>

        <div className="space-y-6">
          {/* 头像 */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* 信息卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">用户 ID</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">语言偏好</p>
              <p className="font-semibold">{user.locale}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">注册时间</p>
              <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-4">快捷操作</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/favorites"
                className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary transition text-center"
              >
                <div className="text-2xl mb-2">❤️</div>
                <p className="font-medium">我的收藏</p>
              </Link>
              <Link
                href="/my-uploads"
                className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary transition text-center"
              >
                <div className="text-2xl mb-2">📤</div>
                <p className="font-medium">我的上传</p>
              </Link>
              <Link
                href="/upload"
                className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary transition text-center"
              >
                <div className="text-2xl mb-2">⬆️</div>
                <p className="font-medium">上传壁纸</p>
              </Link>
              <Link
                href="/settings"
                className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary transition text-center"
              >
                <div className="text-2xl mb-2">⚙️</div>
                <p className="font-medium">设置</p>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

