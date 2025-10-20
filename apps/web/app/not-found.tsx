import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          抱歉，您访问的页面不存在
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold hover:shadow-lg transition inline-block"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}

