<template>
  <div class="api-list-view">
    <div class="page-header">
      <div class="header-left">
        <h2>{{ projectStore.currentProject?.name ?? 'API 列表' }}</h2>
        <el-button link @click="goBack">返回项目列表</el-button>
      </div>
      <el-button type="primary" @click="showCreateDialog = true">新建 API</el-button>
    </div>

    <el-table v-loading="apiStore.loading" :data="apiStore.apis" stripe>
      <el-table-column prop="name" label="名称" min-width="150" />
      <el-table-column label="方法" width="100">
        <template #default="{ row }">
          <el-tag :color="getMethodColor(row.method)" style="color: #fff">{{ row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" min-width="200" />
      <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
      <el-table-column prop="updatedAt" label="更新时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="editApi(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="showCreateDialog"
      :title="editingApi ? '编辑 API' : '新建 API'"
      width="600px"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入 API 名称" />
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-select v-model="formData.method" style="width: 100%">
            <el-option
              v-for="method in HTTP_METHODS"
              :key="method"
              :label="method"
              :value="method"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="formData.path" placeholder="/api/example" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { useProjectStore } from '../stores/project';
import { useApiStore } from '../stores/api';
import { HTTP_METHODS, METHOD_COLORS, type Api, type HttpMethod } from '../types';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const apiStore = useApiStore();

const showCreateDialog = ref(false);
const editingApi = ref<Api | null>(null);
const formRef = ref<FormInstance>();

const formData = reactive({
  name: '',
  method: 'GET' as HttpMethod,
  path: '',
  description: '',
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入 API 名称', trigger: 'blur' }],
  method: [{ required: true, message: '请选择请求方法', trigger: 'change' }],
  path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
};

const projectId = computed(() => Number(route.params.id));

onMounted(async () => {
  const id = projectId.value;
  if (!projectStore.currentProject || projectStore.currentProject.id !== id) {
    const project = await projectStore.getProject(id);
    if (project) {
      projectStore.setCurrentProject(project);
    }
  }
  await apiStore.fetchApis(id);
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN');
}

function getMethodColor(method: string): string {
  return METHOD_COLORS[method as HttpMethod] || '#909399';
}

function goBack() {
  router.push({ name: 'projects' });
}

function editApi(api: Api) {
  editingApi.value = api;
  formData.name = api.name;
  formData.method = api.method;
  formData.path = api.path;
  formData.description = api.description ?? '';
  showCreateDialog.value = true;
}

async function handleSubmit() {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      if (editingApi.value) {
        await apiStore.updateApi(editingApi.value.id, projectId.value, formData);
        ElMessage.success('更新成功');
      } else {
        await apiStore.createApi(projectId.value, {
          name: formData.name,
          method: formData.method,
          path: formData.path,
          description: formData.description || undefined,
        });
        ElMessage.success('创建成功');
      }
      showCreateDialog.value = false;
      resetForm();
    } catch (error) {
      ElMessage.error(String(error));
    }
  });
}

async function handleDelete(api: Api) {
  try {
    await ElMessageBox.confirm('确定要删除该 API 吗？', '提示', { type: 'warning' });
    await apiStore.deleteApi(api.id, projectId.value);
    ElMessage.success('删除成功');
  } catch {
    // 用户取消
  }
}

function resetForm() {
  editingApi.value = null;
  formData.name = '';
  formData.method = 'GET';
  formData.path = '';
  formData.description = '';
  formRef.value?.resetFields();
}
</script>

<style scoped>
.api-list-view {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h2 {
  margin: 0;
}
</style>
