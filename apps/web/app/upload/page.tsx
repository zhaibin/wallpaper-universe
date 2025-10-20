'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface UploadResult {
  success: boolean
  wallpaper?: any
  error?: string
  uploadId?: string
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<UploadResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      // 生成预览
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else if (selectedFile.type.startsWith('video/')) {
        const url = URL.createObjectURL(selectedFile)
        setPreview(url)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      alert('请选择文件')
      return
    }

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('category', category || 'uncategorized')

      const response = await fetch('https://api.anywallpaper.net/v1/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer demo-token', // 实际应用中使用真实 token
        },
        body: formData,
      })

      const data: UploadResult = await response.json()
      setResult(data)

      if (data.success) {
        // 重置表单
        setFile(null)
        setTitle('')
        setCategory('')
        setPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : '上传失败',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold mb-6">上传壁纸</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          上传您的壁纸，AI 将自动分析并生成描述、标签和颜色信息
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 文件选择 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              选择文件 *
            </label>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="space-y-4">
                  {file?.type.startsWith('image/') ? (
                    <div className="relative mx-auto" style={{ maxHeight: 256, width: 'auto' }}>
                      <Image
                        src={preview}
                        alt="Preview"
                        width={512}
                        height={256}
                        className="rounded-lg h-auto w-auto max-h-64"
                        style={{ objectFit: 'contain' }}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <video
                      src={preview}
                      controls
                      className="max-h-64 mx-auto rounded-lg"
                    />
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {file?.name} ({(file!.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    点击上传或拖拽文件到这里
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    支持 JPG, PNG, WebP, GIF, MP4, WebM（最大 50MB）
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              标题（可选）
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如果不填写，AI 将自动生成"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              分类（可选）
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
            >
              <option value="">AI 自动分类</option>
              <option value="nature">自然</option>
              <option value="abstract">抽象</option>
              <option value="minimal">简约</option>
              <option value="dark">暗色</option>
              <option value="colorful">彩色</option>
            </select>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                上传中...（AI 正在分析）
              </span>
            ) : (
              '上传壁纸'
            )}
          </button>
        </form>

        {/* 上传结果 */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg ${
              result.success
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }`}
          >
            <h3 className="font-semibold mb-2">
              {result.success ? '上传成功！' : '上传失败'}
            </h3>
            {result.success && result.wallpaper && (
              <div className="text-sm space-y-2">
                <p><strong>标题:</strong> {result.wallpaper.title}</p>
                <p><strong>描述:</strong> {result.wallpaper.description}</p>
                {result.wallpaper.tags && (
                  <div>
                    <strong>AI 生成的标签:</strong>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.wallpaper.tags.map((tag: any, index: number) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs ${
                            tag.level === 1
                              ? 'bg-blue-100 text-blue-800'
                              : tag.level === 2
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          L{tag.level}: {tag.name} ({Math.round(tag.weight * 100)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {result.wallpaper.colors && (
                  <div>
                    <strong>主要颜色:</strong>
                    <div className="mt-2 flex gap-2">
                      {result.wallpaper.colors.map((color: any, index: number) => (
                        <div key={index} className="text-center">
                          <div
                            className="w-12 h-12 rounded-lg shadow-md"
                            style={{ backgroundColor: color.hex }}
                          />
                          <p className="text-xs mt-1">{color.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {result.error && <p className="text-sm">{result.error}</p>}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

