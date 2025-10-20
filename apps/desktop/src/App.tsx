import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { UploadDialog } from './components/UploadDialog';

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
  const [showUpload, setShowUpload] = useState(false);
  const [queue, setQueue] = useState<Wallpaper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [slideshowEnabled, setSlideshowEnabled] = useState<boolean>(() => {
    const v = localStorage.getItem('desktop_slideshow_enabled');
    return v !== 'false';
  });
  const [slideDurationSec, setSlideDurationSec] = useState<number>(() => {
    const v = parseInt(localStorage.getItem('desktop_slide_duration') || '60', 10);
    return Number.isFinite(v) ? Math.max(10, v) : 60;
  });

  useEffect(() => {
    fetchWallpapers();
  }, []);

  // 轮询用户队列并自动轮播
  useEffect(() => {
    const deviceIdKey = 'device_id';
    let deviceId = localStorage.getItem(deviceIdKey);
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem(deviceIdKey, deviceId);
    }

    let stopped = false;

    const fetchQueue = async () => {
      try {
        const token = localStorage.getItem('auth_token') || '';
        const res = await fetch('https://api.anywallpaper.net/v1/queue', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'X-Client-Id': deviceId as string,
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        const items: any[] = (data.items || data.queue || []).map((x: any) => (
          typeof x === 'string' ? { id: x, url: x, title: '队列壁纸' } : x
        ));
        if (!stopped) {
          setQueue(items as Wallpaper[]);
          if (items.length > 0 && timerRef.current === null) {
            // 立即设置第一张，并启动轮播
            setCurrentIndex(0);
            await setAsWallpaper(items[0] as Wallpaper);
            startTimer(items as Wallpaper[]);
          }
        }
      } catch (e) {
        console.warn('获取队列失败', e);
      }
    };

    fetchQueue();
    const queueInterval = window.setInterval(fetchQueue, 60_000);
    return () => {
      stopped = true;
      window.clearInterval(queueInterval);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const startTimer = (list: Wallpaper[]) => {
    if (timerRef.current) return;
    timerRef.current = window.setInterval(() => {
      setCurrentIndex((idx) => {
        const next = list.length === 0 ? 0 : (idx + 1) % list.length;
        if (list[next]) {
          setAsWallpaper(list[next]);
        }
        return next;
      });
    }, Math.max(10, slideDurationSec) * 1000);
  };

  // 当间隔变化时，重启计时器
  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      if (queue.length > 0 && slideshowEnabled) {
        startTimer(queue);
      }
    }
    localStorage.setItem('desktop_slide_duration', String(slideDurationSec));
  }, [slideDurationSec]);

  // 当开关变化时，启动或停止轮播
  useEffect(() => {
    localStorage.setItem('desktop_slideshow_enabled', String(slideshowEnabled));
    if (!slideshowEnabled && timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (slideshowEnabled && queue.length > 0 && !timerRef.current) {
      startTimer(queue);
    }
  }, [slideshowEnabled]);

  const fetchWallpapers = async () => {
    try {
      setLoading(true);
      // 从API获取壁纸列表
      const response = await fetch('https://api.anywallpaper.net/v1/wallpapers');
      const data = await response.json();
      setWallpapers(Array.isArray(data) ? data : (data.items || []));
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
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="checkbox"
              checked={slideshowEnabled}
              onChange={(e) => setSlideshowEnabled(e.target.checked)}
            />
            启用轮播
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            轮播间隔(秒)
            <input
              type="number"
              min={10}
              value={slideDurationSec}
              onChange={(e) => setSlideDurationSec(parseInt(e.target.value || '60', 10))}
              style={{ width: 80 }}
            />
          </label>
          <button 
            onClick={() => setShowUpload(true)}
            className="upload-btn"
          >
            + 上传壁纸
          </button>
        </div>
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

      {showUpload && <UploadDialog onClose={() => setShowUpload(false)} />}
    </div>
  );
}

export default App;

