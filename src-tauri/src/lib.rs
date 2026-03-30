// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Return a normalized platform string to the frontend.
/// Maps macOS -> "darwin" to match common JS checks.
#[tauri::command]
fn get_platform() -> String {
    // Use cfg to detect platform at compile time
    #[cfg(target_os = "macos")]
    {
        return "darwin".to_string();
    }

    #[cfg(target_os = "windows")]
    {
        return "windows".to_string();
    }

    #[cfg(target_os = "linux")]
    {
        return "linux".to_string();
    }

    // Fallback to Rust's consts
    std::env::consts::OS.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_platform])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
