import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Api } from '../types';
import { query, execute, executeInsert } from '../api';

export const useApiStore = defineStore('api', () => {
  const apis = ref<Api[]>([]);
  const currentApi = ref<Api | null>(null);
  const loading = ref(false);

  async function fetchApis(projectId: number): Promise<void> {
    loading.value = true;
    try {
      const rows = await query<{
        id: number;
        project_id: number;
        name: string;
        method: string;
        path: string;
        description: string | null;
        request_headers: string | null;
        request_params: string | null;
        request_body: string | null;
        response_success: string | null;
        response_error: string | null;
        created_at: string;
        updated_at: string;
      }>('SELECT * FROM apis WHERE project_id = $1 ORDER BY updated_at DESC', [projectId]);
      apis.value = rows.map((row) => ({
        id: row.id,
        projectId: row.project_id,
        name: row.name,
        method: row.method as Api['method'],
        path: row.path,
        description: row.description ?? undefined,
        requestHeaders: row.request_headers ? JSON.parse(row.request_headers) : undefined,
        requestParams: row.request_params ? JSON.parse(row.request_params) : undefined,
        requestBody: row.request_body ? JSON.parse(row.request_body) : undefined,
        responseSuccess: row.response_success ? JSON.parse(row.response_success) : undefined,
        responseError: row.response_error ? JSON.parse(row.response_error) : undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } finally {
      loading.value = false;
    }
  }

  async function createApi(
    projectId: number,
    data: Omit<Api, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>
  ): Promise<Api> {
    const id = await executeInsert(
      `INSERT INTO apis (project_id, name, method, path, description, request_headers, request_params, request_body, response_success, response_error)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        projectId,
        data.name,
        data.method,
        data.path,
        data.description ?? null,
        data.requestHeaders ? JSON.stringify(data.requestHeaders) : null,
        data.requestParams ? JSON.stringify(data.requestParams) : null,
        data.requestBody ? JSON.stringify(data.requestBody) : null,
        data.responseSuccess ? JSON.stringify(data.responseSuccess) : null,
        data.responseError ? JSON.stringify(data.responseError) : null,
      ]
    );
    await fetchApis(projectId);
    return {
      ...data,
      id,
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async function updateApi(
    id: number,
    projectId: number,
    data: Omit<Api, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    await execute(
      `UPDATE apis SET name = $1, method = $2, path = $3, description = $4,
       request_headers = $5, request_params = $6, request_body = $7,
       response_success = $8, response_error = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10`,
      [
        data.name,
        data.method,
        data.path,
        data.description ?? null,
        data.requestHeaders ? JSON.stringify(data.requestHeaders) : null,
        data.requestParams ? JSON.stringify(data.requestParams) : null,
        data.requestBody ? JSON.stringify(data.requestBody) : null,
        data.responseSuccess ? JSON.stringify(data.responseSuccess) : null,
        data.responseError ? JSON.stringify(data.responseError) : null,
        id,
      ]
    );
    await fetchApis(projectId);
  }

  async function deleteApi(id: number, projectId: number): Promise<void> {
    await execute('DELETE FROM apis WHERE id = $1', [id]);
    await fetchApis(projectId);
  }

  async function getApi(id: number): Promise<Api | null> {
    const rows = await query<{
      id: number;
      project_id: number;
      name: string;
      method: string;
      path: string;
      description: string | null;
      request_headers: string | null;
      request_params: string | null;
      request_body: string | null;
      response_success: string | null;
      response_error: string | null;
      created_at: string;
      updated_at: string;
    }>('SELECT * FROM apis WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      projectId: row.project_id,
      name: row.name,
      method: row.method as Api['method'],
      path: row.path,
      description: row.description ?? undefined,
      requestHeaders: row.request_headers ? JSON.parse(row.request_headers) : undefined,
      requestParams: row.request_params ? JSON.parse(row.request_params) : undefined,
      requestBody: row.request_body ? JSON.parse(row.request_body) : undefined,
      responseSuccess: row.response_success ? JSON.parse(row.response_success) : undefined,
      responseError: row.response_error ? JSON.parse(row.response_error) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  function setCurrentApi(api: Api | null) {
    currentApi.value = api;
  }

  return {
    apis,
    currentApi,
    loading,
    fetchApis,
    createApi,
    updateApi,
    deleteApi,
    getApi,
    setCurrentApi,
  };
});
