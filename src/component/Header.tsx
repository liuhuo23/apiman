import { useContext, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Header } from "antd/es/layout/layout";
import { ThemeContext } from '@/styles/theme-provider';
import { Button } from "antd";
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

export const MyHeader: React.FC = () => { 
    const appWindow = getCurrentWindow();
    const [isMac, setIsMac] = useState(false);
    const { mode, toggle } = useContext(ThemeContext);
      
    useEffect(() => {
        // Query platform from Rust backend for consistent behavior
        invoke('get_platform')
            .then((p: any) => setIsMac(String(p) === 'darwin'))
            .catch(() => {});
    }, []);

    useEffect(() => {
      // Manual implementation for drag/toggle behavior when data-tauri-drag-region isn't used
      const el = document.getElementById('titlebar');
      if (!el) return;

      const onMouseDown = (e: MouseEvent) => {
        // only respond to primary button
        if ((e as any).buttons !== 1) return;
        // call startDragging on primary press (single click + move)
        try {
          (appWindow as any).startDragging?.();
        } catch (err) {
          // ignore if not available
        }
      };

      const onDblClick = async () => {
        try {
          await (appWindow as any).toggleMaximize?.();
        } catch (err) {}
      };

      el.addEventListener('mousedown', onMouseDown);
      el.addEventListener('dblclick', onDblClick);

      return () => {
        el.removeEventListener('mousedown', onMouseDown);
        el.removeEventListener('dblclick', onDblClick);
      };
    }, [appWindow]);

    return (
        <Header className={`app-header ${isMac ? 'mac-traffic-padding' : ''}` } data-tauri-drag-region>
        <div id="titlebar" className="app-left">
          
        </div>
        <div className="app-right">
          {/* theme toggle */}
          <Button onClick={toggle} icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />} style={{ WebkitAppRegion: 'no-drag' } as any} aria-label="toggle-theme" />

          {/* custom window controls for non-mac platforms */}
          {!isMac && (
            <div className="window-controls" style={{ display: 'flex', gap: 8, marginLeft: 8 }}>
              <button id="titlebar-minimize" title="minimize" className="win-btn win-min" onClick={async () => await appWindow.minimize()} aria-label="Minimize" />
              <button id="titlebar-maximize" title="maximize" className="win-btn win-max" onClick={async () => {
                const isMax = await appWindow.isMaximized();
                isMax ? appWindow.unmaximize() : appWindow.maximize();
              }} aria-label="Maximize" />
              <button id="titlebar-close" title="close" className="win-btn win-close" onClick={async () => await appWindow.close()} aria-label="Close" />
            </div>
          )}
        </div>
      </Header>
    )
}