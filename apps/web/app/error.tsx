'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">出错了</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || '页面加载失败'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
        >
          重试
        </button>
      </div>
    </div>
  )
}

