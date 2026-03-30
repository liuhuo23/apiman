export const lightTokens = {
  // Brand / primary
  colorPrimary: '#1677ff',

  // Functional colors
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',

  // Text colors
  colorText: 'rgba(0,0,0,0.88)',
  colorTextSecondary: 'rgba(0,0,0,0.65)',
  colorTextDisabled: 'rgba(0,0,0,0.25)',

  // Background & border
  colorBgContainer: '#ffffff',
  colorBgLayout: '#f5f5f5',
  colorBgElevated: '#ffffff',
  colorBorder: '#d9d9d9',

  // Radius
  borderRadius: 8,
};

export const darkTokens = {
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',

  colorText: 'rgba(255,255,255,0.9)',
  colorTextSecondary: 'rgba(255,255,255,0.65)',
  colorTextDisabled: 'rgba(255,255,255,0.25)',

  colorBgContainer: '#1f1f1f',
  colorBgLayout: '#141414',
  colorBgElevated: '#1f1f1f',
  colorBorder: 'rgba(255,255,255,0.06)',

  borderRadius: 8,
};

export function getTokensForMode(mode: 'light' | 'dark') {
  return mode === 'dark' ? darkTokens : lightTokens;
}

export default { lightTokens, darkTokens, getTokensForMode };
