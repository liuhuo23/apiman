<template>
  <div class="project-view">
    <div class="page-header">
      <h2>项目管理</h2>
      <el-button type="primary" @click="showCreateDialog = true">新建项目</el-button>
    </div>

    <el-table v-loading="projectStore.loading" :data="projectStore.projects" stripe>
      <el-table-column prop="name" label="名称" min-width="150" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="updatedAt" label="更新时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openProject(row)">打开</el-button>
          <el-button link type="primary" size="small" @click="editProject(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="showCreateDialog"
      :title="editingProject ? '编辑项目' : '新建项目'"
      width="500px"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入项目名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述"
          />
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { useProjectStore } from '../stores/project';
import type { Project } from '../types';

const router = useRouter();
const projectStore = useProjectStore();

const showCreateDialog = ref(false);
const editingProject = ref<Project | null>(null);
const formRef = ref<FormInstance>();

const formData = reactive({
  name: '',
  description: '',
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
};

onMounted(() => {
  projectStore.fetchProjects();
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN');
}

async function openProject(project: Project) {
  projectStore.setCurrentProject(project);
  router.push({ name: 'api-list', params: { id: project.id } });
}

function editProject(project: Project) {
  editingProject.value = project;
  formData.name = project.name;
  formData.description = project.description ?? '';
  showCreateDialog.value = true;
}

async function handleSubmit() {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      if (editingProject.value) {
        await projectStore.updateProject(editingProject.value.id, formData.name, formData.description);
        ElMessage.success('更新成功');
      } else {
        await projectStore.createProject(formData.name, formData.description);
        ElMessage.success('创建成功');
      }
      showCreateDialog.value = false;
      resetForm();
    } catch (error) {
      ElMessage.error(String(error));
    }
  });
}

async function handleDelete(project: Project) {
  try {
    await ElMessageBox.confirm('确定要删除该项目吗？删除后将同时删除该项目的所有 API', '提示', {
      type: 'warning',
    });
    await projectStore.deleteProject(project.id);
    ElMessage.success('删除成功');
  } catch {
    // 用户取消
  }
}

function resetForm() {
  editingProject.value = null;
  formData.name = '';
  formData.description = '';
  formRef.value?.resetFields();
}
</script>

<style scoped>
.project-view {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}
</style>
