export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg"></div>
              <span className="text-xl font-bold">AnyWallpaper</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              精选高清壁纸，支持iOS、Android、Windows、macOS等多平台
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">产品</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="/download" className="hover:text-primary transition">桌面应用</a></li>
              <li><a href="/download" className="hover:text-primary transition">移动应用</a></li>
              <li><a href="/api" className="hover:text-primary transition">API</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">关于</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><a href="/about" className="hover:text-primary transition">关于我们</a></li>
              <li><a href="/privacy" className="hover:text-primary transition">隐私政策</a></li>
              <li><a href="/terms" className="hover:text-primary transition">服务条款</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} AnyWallpaper. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

