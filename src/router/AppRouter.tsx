import { Navigate, Outlet, Route, Routes, matchPath, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import HomePage from "../pages/HomePage";
import ProjectDocsPage from "../pages/ProjectDocsPage";
import ProjectLayout from "../pages/ProjectLayout";
import ProjectSettingsPage from "../pages/ProjectSettingsPage";
import ProjectTestPage from "../pages/ProjectTestPage";
import type { ShellSection } from "../types/app-shell";
import { projectDocsPath } from "./paths";

const defaultProjectId = "sample-project";
const themeStorageKey = "apiman-theme-mode";

const sections: ShellSection[] = [
  {
    key: "home",
    label: "主页",
    description: "项目入口和全局切换",
    badge: "01",
    path: "/",
  },
  {
    key: "project",
    label: "项目详情",
    description: "详情布局和子路由出口",
    badge: "02",
    path: projectDocsPath(defaultProjectId),
  },
  {
    key: "settings",
    label: "项目设置",
    description: "全局参数和环境配置",
    badge: "03",
    path: "/settings",
  },
];

function ShellLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    const saved = window.localStorage.getItem(themeStorageKey);

    return saved === "light" ? "light" : "dark";
  });

  const projectMatch = matchPath("/projects/:projectId/*", location.pathname);
  const activeSectionKey = projectMatch
    ? "project"
    : matchPath("/settings", location.pathname)
      ? "settings"
      : "home";

  const currentProjectId = projectMatch?.params.projectId ?? defaultProjectId;

  useEffect(() => {
    document.body.dataset.theme = themeMode;
    window.localStorage.setItem(themeStorageKey, themeMode);
  }, [themeMode]);

  return (
    <AppShell
      themeMode={themeMode}
      onThemeModeChange={setThemeMode}
      sections={sections}
      activeSectionKey={activeSectionKey}
      onSectionChange={(key) => {
        if (key === "home") {
          navigate("/");
          return;
        }

        if (key === "settings") {
          navigate("/settings");
          return;
        }

        navigate(projectDocsPath(currentProjectId));
      }}
    >
      <Outlet />
    </AppShell>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<Navigate replace to="docs" />} />
          <Route path="docs" element={<ProjectDocsPage />} />
          <Route path="test" element={<ProjectTestPage />} />
        </Route>
        <Route path="settings" element={<ProjectSettingsPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
