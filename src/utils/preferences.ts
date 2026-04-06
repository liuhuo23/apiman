import type { AppPreferences, CommandMode, ThemeMode } from "../types/app-settings";

export const THEME_STORAGE_KEY = "apiman-theme-mode";
export const COMMAND_MODE_STORAGE_KEY = "apiman-command-mode";

export function getInitialThemeMode(): ThemeMode {
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);

  return saved === "light" ? "light" : "dark";
}

export function getInitialCommandMode(): CommandMode {
  const saved = window.localStorage.getItem(COMMAND_MODE_STORAGE_KEY);

  return saved === "command" ? "command" : "standard";
}

export function getInitialPreferences(): AppPreferences {
  return {
    themeMode: getInitialThemeMode(),
    commandMode: getInitialCommandMode(),
  };
}

export function applyAppPreferences(preferences: AppPreferences) {
  document.body.dataset.theme = preferences.themeMode;
  document.body.dataset.commandMode = preferences.commandMode;
}

export function saveThemeMode(themeMode: ThemeMode) {
  window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
}

export function saveCommandMode(commandMode: CommandMode) {
  window.localStorage.setItem(COMMAND_MODE_STORAGE_KEY, commandMode);
}
