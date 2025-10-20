'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                出错了
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {this.state.error?.message || '页面加载失败，请刷新重试'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition"
              >
                刷新页面
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

