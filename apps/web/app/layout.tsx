import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Analytics } from './components/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.anywallpaper.net'),
  title: {
    default: 'AnyWallpaper - 精选高清壁纸',
    template: '%s | AnyWallpaper',
  },
  description: '发现和下载精美的高清壁纸，支持iOS、Android、Windows、macOS等多平台',
  keywords: ['壁纸', '高清壁纸', 'wallpaper', '桌面壁纸', '手机壁纸'],
  alternates: {
    canonical: 'https://www.anywallpaper.net',
  },
  authors: [{ name: 'AnyWallpaper Team' }],
  openGraph: {
    title: 'AnyWallpaper - 精选高清壁纸',
    description: '发现和下载精美的高清壁纸',
    type: 'website',
    url: 'https://www.anywallpaper.net',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnyWallpaper - 精选高清壁纸',
    description: '发现和下载精美的高清壁纸',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}

