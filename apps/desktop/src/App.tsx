import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface Wallpaper {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  category?: string;
}

function App() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  useEffect(() => {
    fetchWallpapers();
  }, []);

  const fetchWallpapers = async () => {
    try {
      setLoading(true);
      // 从API获取壁纸列表
      const response = await fetch('https://api.anywallpaper.com/v1/wallpapers');
      const data = await response.json();
      setWallpapers(data);
    } catch (error) {
      console.error('获取壁纸失败:', error);
      // 使用演示数据
      setWallpapers([
        { id: '1', title: '演示壁纸', url: '/assets/sample.jpg' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const setAsWallpaper = async (wallpaper: Wallpaper) => {
    try {
      await invoke('set_wallpaper', { url: wallpaper.url });
      alert('壁纸设置成功！');
    } catch (error) {
      console.error('设置壁纸失败:', error);
      alert('设置壁纸失败：' + error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>AnyWallpaper Desktop</h1>
        <p>精选高清壁纸，一键设置桌面</p>
      </header>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="gallery">
          {wallpapers.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className="wallpaper-card"
              onClick={() => setSelectedWallpaper(wallpaper)}
            >
              <img
                src={wallpaper.thumbnail || wallpaper.url}
                alt={wallpaper.title}
              />
              <div className="wallpaper-info">
                <h3>{wallpaper.title}</h3>
                {wallpaper.category && <span className="category">{wallpaper.category}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWallpaper && (
        <div className="modal" onClick={() => setSelectedWallpaper(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedWallpaper.url} alt={selectedWallpaper.title} />
            <div className="modal-actions">
              <h2>{selectedWallpaper.title}</h2>
              <button onClick={() => setAsWallpaper(selectedWallpaper)}>
                设为壁纸
              </button>
              <button onClick={() => setSelectedWallpaper(null)}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

