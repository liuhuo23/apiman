export const appPaths = {
  home: "/",
  settings: "/settings",
  projectRoot: "/projects/:projectId",
  projectDocs: "/projects/:projectId/docs",
  projectTest: "/projects/:projectId/test",
} as const;

export function projectDocsPath(projectId: string) {
  return `/projects/${projectId}/docs`;
}

export function projectTestPath(projectId: string) {
  return `/projects/${projectId}/test`;
}

export function projectRootPath(projectId: string) {
  return `/projects/${projectId}`;
}
