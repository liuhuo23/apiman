import { HashRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import AppRouter from "./router/AppRouter";
import { AppPreferencesProvider, useAppPreferences } from "./stores/appPreferences";

function AppContent() {
  const { themeMode } = useAppPreferences();

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#38bdf8",
          borderRadius: 14,
          fontFamily:
            '"Avenir Next", "Segoe UI Variable", "Segoe UI", "PingFang SC", "Hiragino Sans", "Microsoft YaHei", sans-serif',
        },
      }}
    >
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </ConfigProvider>
  );
}

function App() {
  return (
    <AppPreferencesProvider>
      <AppContent />
    </AppPreferencesProvider>
  );
}

export default App;
