// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[derive(Clone, serde::Serialize)]
struct WallpaperPayload {
    message: String,
}

// 设置壁纸命令
#[tauri::command]
async fn set_wallpaper(url: String) -> Result<String, String> {
    // 下载壁纸
    let response = reqwest::get(&url)
        .await
        .map_err(|e| format!("下载失败: {}", e))?;
    
    let bytes = response
        .bytes()
        .await
        .map_err(|e| format!("读取失败: {}", e))?;

    // 保存到临时文件
    let temp_dir = std::env::temp_dir();
    let file_path = temp_dir.join("anywallpaper_temp.jpg");
    
    std::fs::write(&file_path, bytes)
        .map_err(|e| format!("保存失败: {}", e))?;

    // 设置为壁纸
    wallpaper::set_from_path(file_path.to_str().unwrap())
        .map_err(|e| format!("设置壁纸失败: {}", e))?;

    Ok("壁纸设置成功".to_string())
}

// 获取当前壁纸
#[tauri::command]
fn get_wallpaper() -> Result<String, String> {
    wallpaper::get()
        .map_err(|e| format!("获取壁纸失败: {}", e))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![set_wallpaper, get_wallpaper])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("运行Tauri应用时出错");
}

