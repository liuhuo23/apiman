<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-left">
        <h1>API Manager</h1>
      </div>
    </el-header>
    <el-container>
      <el-aside v-if="showSidebar" class="app-sidebar">
        <el-menu
          :default-active="currentProject?.id.toString()"
          @select="handleMenuSelect"
        >
          <el-menu-item
            v-for="project in projectStore.projects"
            :key="project.id"
            :index="project.id.toString()"
          >
            <span>{{ project.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';

const router = useRouter();
const projectStore = useProjectStore();

const showSidebar = computed(() => projectStore.projects.length > 0);
const currentProject = computed(() => projectStore.currentProject);

async function handleMenuSelect(index: string) {
  const project = await projectStore.getProject(Number(index));
  if (project) {
    projectStore.setCurrentProject(project);
    router.push({ name: 'api-list', params: { id: project.id } });
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.app-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.app-sidebar {
  width: 240px;
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
}

.app-main {
  padding: 20px;
  background-color: #fafafa;
}
</style>
