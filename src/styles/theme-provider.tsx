import React, { useEffect, useMemo, useState } from 'react';
import { ConfigProvider } from 'antd';
import { getTokensForMode } from './antd-theme';

type ThemeMode = 'light' | 'dark';

export const ThemeContext = React.createContext({
  mode: 'light' as ThemeMode,
  toggle: () => {},
});

function applyCssVarsFromTokens(tokens: Record<string, any>) {
  const mapping: Record<string, string> = {
    colorPrimary: '--color-primary',
    colorSuccess: '--color-success',
    colorWarning: '--color-warning',
    colorError: '--color-error',
    colorInfo: '--color-info',

    colorText: '--color-text',
    colorTextSecondary: '--color-text-secondary',
    colorTextDisabled: '--color-text-disabled',

    colorBgLayout: '--color-bg-layout',
    colorBgContainer: '--color-bg-container',
    colorBorder: '--color-border',
  };

  const root = document.documentElement;
  Object.entries(mapping).forEach(([tokenKey, cssVar]) => {
    if (tokens[tokenKey] != null) {
      root.style.setProperty(cssVar, tokens[tokenKey]);
    }
  });
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const tokens = useMemo(() => ({ token: getTokensForMode(mode) }), [mode]);

  useEffect(() => {
    // Apply CSS variables to :root to keep App.css in sync
    applyCssVarsFromTokens(tokens.token as Record<string, any>);
    // also set a data attribute for styling if needed
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode, tokens]);

  function toggle() {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <ConfigProvider theme={tokens}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
