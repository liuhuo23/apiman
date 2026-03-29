export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Api {
  id: number;
  projectId: number;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description?: string;
  requestHeaders?: Record<string, string>;
  requestParams?: Record<string, unknown>;
  requestBody?: unknown;
  responseSuccess?: unknown;
  responseError?: unknown;
  createdAt: string;
  updatedAt: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: '#67C23A',
  POST: '#409EFF',
  PUT: '#E6A23C',
  DELETE: '#F56C6C',
  PATCH: '#909399',
};
