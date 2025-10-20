'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 页面浏览追踪
    if (typeof window !== 'undefined') {
      // 这里可以集成 Google Analytics, Plausible 等
      const url = `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`
      console.log('Page view:', url)
      
      // 示例: 发送到 Cloudflare Analytics
      if ('navigator' in window && 'sendBeacon' in navigator) {
        const data = JSON.stringify({
          event: 'pageview',
          url,
          timestamp: new Date().toISOString(),
        })
        // navigator.sendBeacon('/api/analytics', data)
      }
    }
  }, [pathname, searchParams])

  return null
}

