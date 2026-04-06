import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProjectDocsPage from "../pages/ProjectDocsPage";
import ProjectLayout from "../pages/ProjectLayout";
import AppSettingsPage from "../pages/AppSettingsPage";
import ProjectTestPage from "../pages/ProjectTestPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="projects/:projectId" element={<ProjectLayout />}>
        <Route index element={<Navigate replace to="docs" />} />
        <Route path="docs" element={<ProjectDocsPage />} />
        <Route path="test" element={<ProjectTestPage />} />
      </Route>
      <Route path="settings" element={<AppSettingsPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default AppRouter;
