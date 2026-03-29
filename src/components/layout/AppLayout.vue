<template>
  <div class="app-container">
    <div class="titlebar" data-tauri-drag-region>
      <div class="traffic-lights" v-if="isMac">
        <div class="light close" @click="handleClose"></div>
        <div class="light minimize" @click="handleMinimize"></div>
        <div class="light maximize" @click="handleMaximize"></div>
      </div>
      <div class="titlebar-tabs">
        <div
          v-for="project in projectStore.projects"
          :key="project.id"
          class="tab-item"
          :class="{ active: currentProject?.id === project.id }"
          @click="selectProject(project)"
        >
          <span class="tab-name">{{ project.name }}</span>
          <span class="tab-close" @click.stop="closeProject(project.id)">×</span>
        </div>
        <div class="tab-add" @click="showCreateProject = true">+</div>
      </div>
      <div class="titlebar-actions">
        <el-button size="small" @click="showCreateProject = true">新建项目</el-button>
      </div>
    </div>

    <div class="app-body">
      <div class="sidebar">
        <div class="sidebar-header">
          <span>项目列表</span>
        </div>
        <div class="project-list">
          <div
            v-for="project in projectStore.projects"
            :key="project.id"
            class="project-item"
            :class="{ active: currentProject?.id === project.id }"
            @click="selectProject(project)"
          >
            <span class="project-name">{{ project.name }}</span>
          </div>
          <div v-if="projectStore.projects.length === 0" class="empty-tip">
            暂无项目
          </div>
        </div>
      </div>

      <div class="main-area">
        <div class="content-left">
          <div class="content-header">
            <span>接口列表</span>
            <el-button size="small" type="primary" @click="showCreateApi = true" :disabled="!currentProject">新建</el-button>
          </div>
          <div class="api-list">
            <div
              v-for="api in apiStore.apis"
              :key="api.id"
              class="api-item"
              :class="{ active: currentApi?.id === api.id }"
              @click="selectApi(api)"
            >
              <el-tag :color="getMethodColor(api.method)" size="small">{{ api.method }}</el-tag>
              <span class="api-name">{{ api.name }}</span>
            </div>
            <div v-if="apiStore.apis.length === 0 && currentProject" class="empty-tip">
              暂无接口
            </div>
            <div v-if="!currentProject" class="empty-tip">
              请先选择项目
            </div>
          </div>
        </div>

        <div class="content-right">
          <template v-if="currentApi">
            <div class="detail-header">
              <div class="detail-title">
                <el-tag :color="getMethodColor(currentApi.method)">{{ currentApi.method }}</el-tag>
                <h3>{{ currentApi.name }}</h3>
              </div>
              <div class="detail-actions">
                <el-button @click="editApi">编辑</el-button>
                <el-button type="danger" @click="deleteApi">删除</el-button>
              </div>
            </div>
            <el-tabs v-model="activeTab" class="detail-tabs">
              <el-tab-pane label="基本信息" name="basic">
                <div class="tab-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <label>路径</label>
                      <span>{{ currentApi.path }}</span>
                    </div>
                    <div class="info-item">
                      <label>描述</label>
                      <span>{{ currentApi.description || '-' }}</span>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Headers" name="headers">
                <div class="tab-content">
                  <JsonEditor v-model="currentApi.requestHeaders" readonly />
                </div>
              </el-tab-pane>
              <el-tab-pane label="Params" name="params">
                <div class="tab-content">
                  <JsonEditor v-model="currentApi.requestParams" readonly />
                </div>
              </el-tab-pane>
              <el-tab-pane label="Body" name="body">
                <div class="tab-content">
                  <JsonEditor v-model="currentApi.requestBody" readonly />
                </div>
              </el-tab-pane>
              <el-tab-pane label="成功响应" name="success">
                <div class="tab-content">
                  <JsonEditor v-model="currentApi.responseSuccess" readonly />
                </div>
              </el-tab-pane>
              <el-tab-pane label="错误响应" name="error">
                <div class="tab-content">
                  <JsonEditor v-model="currentApi.responseError" readonly />
                </div>
              </el-tab-pane>
            </el-tabs>
          </template>
          <div v-else class="empty-detail">
            <p>选择左侧接口查看详情</p>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showCreateProject" title="新建项目" width="400px">
      <el-form @submit.prevent="createProject">
        <el-form-item label="名称">
          <el-input v-model="newProjectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newProjectDesc" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateProject = false">取消</el-button>
        <el-button type="primary" @click="createProject">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showCreateApi" title="新建接口" width="500px">
      <el-form @submit.prevent="createApi">
        <el-form-item label="名称" required>
          <el-input v-model="newApiName" placeholder="请输入接口名称" />
        </el-form-item>
        <el-form-item label="方法" required>
          <el-select v-model="newApiMethod" style="width: 100%">
            <el-option v-for="m in HTTP_METHODS" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" required>
          <el-input v-model="newApiPath" placeholder="/api/example" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newApiDesc" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateApi = false">取消</el-button>
        <el-button type="primary" @click="createApi">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showEditApi" title="编辑接口" width="500px">
      <el-form @submit.prevent="saveApiEdit">
        <el-form-item label="名称" required>
          <el-input v-model="editApiData.name" />
        </el-form-item>
        <el-form-item label="方法" required>
          <el-select v-model="editApiData.method" style="width: 100%">
            <el-option v-for="m in HTTP_METHODS" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" required>
          <el-input v-model="editApiData.path" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editApiData.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditApi = false">取消</el-button>
        <el-button type="primary" @click="saveApiEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useProjectStore } from '@/stores/project';
import { useApiStore } from '@/stores/api';
import { HTTP_METHODS, METHOD_COLORS, type Project, type Api, type HttpMethod } from '@/types';
import JsonEditor from '@/components/common/JsonEditor.vue';

const projectStore = useProjectStore();
const apiStore = useApiStore();

const isMac = computed(() => {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
});

const currentProject = computed(() => projectStore.currentProject);
const currentApi = computed(() => apiStore.currentApi);

const activeTab = ref('basic');

const showCreateProject = ref(false);
const newProjectName = ref('');
const newProjectDesc = ref('');

const showCreateApi = ref(false);
const newApiName = ref('');
const newApiMethod = ref<HttpMethod>('GET');
const newApiPath = ref('');
const newApiDesc = ref('');

const showEditApi = ref(false);
const editApiData = reactive({
  id: 0,
  name: '',
  method: 'GET' as HttpMethod,
  path: '',
  description: '',
});

onMounted(async () => {
  await projectStore.fetchProjects();
  if (projectStore.projects.length > 0) {
    await selectProject(projectStore.projects[0]);
  }
});

async function selectProject(project: Project) {
  projectStore.setCurrentProject(project);
  await apiStore.fetchApis(project.id);
  apiStore.setCurrentApi(null);
  activeTab.value = 'basic';
}

async function closeProject(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除该项目吗？', '提示', { type: 'warning' });
    await projectStore.deleteProject(id);
    if (currentProject.value?.id === id) {
      const remaining = projectStore.projects;
      if (remaining.length > 0) {
        await selectProject(remaining[0]);
      } else {
        projectStore.setCurrentProject(null);
        apiStore.setCurrentApi(null);
        apiStore.apis = [];
      }
    }
    ElMessage.success('删除成功');
  } catch {
    // 用户取消
  }
}

async function createProject() {
  if (!newProjectName.value.trim()) {
    ElMessage.warning('请输入项目名称');
    return;
  }
  try {
    const project = await projectStore.createProject(newProjectName.value, newProjectDesc.value);
    showCreateProject.value = false;
    newProjectName.value = '';
    newProjectDesc.value = '';
    await selectProject(project);
    ElMessage.success('创建成功');
  } catch (e) {
    ElMessage.error(String(e));
  }
}

function selectApi(api: Api) {
  apiStore.setCurrentApi(api);
  activeTab.value = 'basic';
}

async function createApi() {
  if (!newApiName.value.trim() || !newApiPath.value.trim()) {
    ElMessage.warning('请填写必填项');
    return;
  }
  if (!currentProject.value) {
    ElMessage.warning('请先选择项目');
    return;
  }
  try {
    await apiStore.createApi(currentProject.value.id, {
      name: newApiName.value,
      method: newApiMethod.value,
      path: newApiPath.value,
      description: newApiDesc.value || undefined,
    });
    showCreateApi.value = false;
    newApiName.value = '';
    newApiPath.value = '';
    newApiDesc.value = '';
    ElMessage.success('创建成功');
  } catch (e) {
    ElMessage.error(String(e));
  }
}

function editApi() {
  if (!currentApi.value) return;
  editApiData.id = currentApi.value.id;
  editApiData.name = currentApi.value.name;
  editApiData.method = currentApi.value.method;
  editApiData.path = currentApi.value.path;
  editApiData.description = currentApi.value.description ?? '';
  showEditApi.value = true;
}

async function saveApiEdit() {
  if (!currentProject.value) return;
  try {
    await apiStore.updateApi(editApiData.id, currentProject.value.id, {
      name: editApiData.name,
      method: editApiData.method,
      path: editApiData.path,
      description: editApiData.description || undefined,
    });
    const updated = await apiStore.getApi(editApiData.id);
    if (updated) apiStore.setCurrentApi(updated);
    showEditApi.value = false;
    ElMessage.success('保存成功');
  } catch (e) {
    ElMessage.error(String(e));
  }
}

async function deleteApi() {
  if (!currentApi.value || !currentProject.value) return;
  try {
    await ElMessageBox.confirm('确定要删除该接口吗？', '提示', { type: 'warning' });
    await apiStore.deleteApi(currentApi.value.id, currentProject.value.id);
    apiStore.setCurrentApi(null);
    ElMessage.success('删除成功');
  } catch {
    // 用户取消
  }
}

function getMethodColor(method: string): string {
  return METHOD_COLORS[method as HttpMethod] || '#909399';
}

async function handleClose() {
  const win = getCurrentWindow();
  await win.close();
}

async function handleMinimize() {
  const win = getCurrentWindow();
  await win.minimize();
}

async function handleMaximize() {
  const win = getCurrentWindow();
  const isMax = await win.isMaximized();
  if (isMax) {
    await win.unmaximize();
  } else {
    await win.maximize();
  }
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.titlebar {
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  padding: 0 10px;
  user-select: none;
  flex-shrink: 0;
}

.traffic-lights {
  display: flex;
  gap: 8px;
  margin-right: 20px;
}

.light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.light.close {
  background: #ff5f57;
}

.light.minimize {
  background: #ffbd2e;
}

.light.maximize {
  background: #28c940;
}

.titlebar-tabs {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 2px;
  overflow-x: auto;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  max-width: 160px;
  transition: background 0.2s;
}

.tab-item:hover {
  background: #e0e0e0;
}

.tab-item.active {
  background: #f0f2f5;
}

.tab-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.tab-close {
  font-size: 16px;
  line-height: 1;
  color: #999;
  padding: 0 2px;
}

.tab-close:hover {
  color: #333;
}

.tab-add {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  font-size: 18px;
}

.tab-add:hover {
  color: #409eff;
}

.titlebar-actions {
  padding-left: 20px;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e6e6e6;
  font-weight: 500;
  font-size: 14px;
}

.project-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.project-item {
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
  font-size: 14px;
}

.project-item:hover {
  background: #f5f7fa;
}

.project-item.active {
  background: #ecf5ff;
  color: #409eff;
}

.main-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.content-left {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.content-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
}

.api-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.api-item:hover {
  background: #f5f7fa;
}

.api-item.active {
  background: #ecf5ff;
}

.api-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.content-right {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-title h3 {
  margin: 0;
  font-size: 18px;
}

.detail-actions {
  display: flex;
  gap: 8px;
}

.detail-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: auto;
}

.tab-content {
  padding: 16px 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 12px;
  color: #999;
}

.info-item span {
  font-size: 14px;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 20px;
  font-size: 14px;
}

.empty-detail {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
</style>
