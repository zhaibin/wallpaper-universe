import { useState } from 'react';

interface UploadDialogProps {
  onClose: () => void;
}

export function UploadDialog({ onClose }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert('请选择文件');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('category', category || 'uncategorized');

      const response = await fetch('https://api.anywallpaper.net/v1/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer demo-token',
        },
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : '上传失败',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">上传壁纸</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">选择文件 *</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">标题（可选）</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="AI 将自动生成"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">分类（可选）</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
            >
              <option value="">AI 自动分类</option>
              <option value="nature">自然</option>
              <option value="abstract">抽象</option>
              <option value="minimal">简约</option>
              <option value="dark">暗色</option>
              <option value="colorful">彩色</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {uploading ? '上传中...' : '上传壁纸'}
          </button>
        </form>

        {result && (
          <div className={`mt-4 p-4 rounded-lg ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-semibold">
              {result.success ? '上传成功！' : '上传失败'}
            </p>
            {result.error && <p className="text-sm mt-1">{result.error}</p>}
            {result.success && result.wallpaper && (
              <p className="text-sm mt-1">
                {result.wallpaper.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

