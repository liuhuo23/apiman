import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppPreferences, CommandMode, ThemeMode } from "../types/app-settings";
import {
  applyAppPreferences,
  getInitialPreferences,
  saveCommandMode,
  saveThemeMode,
} from "../utils/preferences";

type AppPreferencesContextValue = AppPreferences & {
  setThemeMode: (mode: ThemeMode) => void;
  setCommandMode: (mode: CommandMode) => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

type AppPreferencesProviderProps = {
  children: ReactNode;
};

export function AppPreferencesProvider({ children }: AppPreferencesProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getInitialPreferences().themeMode);
  const [commandMode, setCommandModeState] = useState<CommandMode>(() => getInitialPreferences().commandMode);

  useEffect(() => {
    applyAppPreferences({ themeMode, commandMode });
  }, [commandMode, themeMode]);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      themeMode,
      commandMode,
      setThemeMode: (mode: ThemeMode) => {
        setThemeModeState(mode);
        saveThemeMode(mode);
      },
      setCommandMode: (mode: CommandMode) => {
        setCommandModeState(mode);
        saveCommandMode(mode);
      },
    }),
    [commandMode, themeMode],
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }

  return context;
}
