import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project } from '../types';
import { query, execute, executeInsert } from '../api';

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([]);
  const currentProject = ref<Project | null>(null);
  const loading = ref(false);

  async function fetchProjects() {
    loading.value = true;
    try {
      const rows = await query<{
        id: number;
        name: string;
        description: string | null;
        created_at: string;
        updated_at: string;
      }>('SELECT * FROM projects ORDER BY updated_at DESC');
      projects.value = rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } finally {
      loading.value = false;
    }
  }

  async function createProject(name: string, description: string): Promise<Project> {
    const id = await executeInsert(
      'INSERT INTO projects (name, description) VALUES ($1, $2)',
      [name, description]
    );
    await fetchProjects();
    return {
      id,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async function updateProject(id: number, name: string, description: string): Promise<void> {
    await execute(
      'UPDATE projects SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [name, description, id]
    );
    await fetchProjects();
  }

  async function deleteProject(id: number): Promise<void> {
    await execute('DELETE FROM projects WHERE id = $1', [id]);
    await fetchProjects();
  }

  async function getProject(id: number): Promise<Project | null> {
    const rows = await query<{
      id: number;
      name: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    }>('SELECT * FROM projects WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  function setCurrentProject(project: Project | null) {
    currentProject.value = project;
  }

  return {
    projects,
    currentProject,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    setCurrentProject,
  };
});
