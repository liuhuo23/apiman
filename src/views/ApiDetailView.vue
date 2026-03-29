<template>
  <div class="api-detail-view">
    <div class="page-header">
      <div class="header-left">
        <h2>{{ apiStore.currentApi?.name ?? 'API 详情' }}</h2>
        <el-button link @click="goBack">返回列表</el-button>
      </div>
    </div>

    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-card class="basic-info">
        <template #header>基本信息</template>
        <el-form-item label="名称" required>
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="方法" required>
          <el-select v-model="formData.method" style="width: 100%">
            <el-option v-for="m in HTTP_METHODS" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" required>
          <el-input v-model="formData.path" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-card>

      <el-card class="request-info">
        <template #header>请求参数</template>
        <el-tabs>
          <el-tab-pane label="Headers">
            <JsonEditor v-model="formData.requestHeaders" />
          </el-tab-pane>
          <el-tab-pane label="Params">
            <JsonEditor v-model="formData.requestParams" />
          </el-tab-pane>
          <el-tab-pane label="Body">
            <JsonEditor v-model="formData.requestBody" />
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-card class="response-info">
        <template #header>响应参数</template>
        <el-tabs>
          <el-tab-pane label="成功响应">
            <JsonEditor v-model="formData.responseSuccess" />
          </el-tab-pane>
          <el-tab-pane label="错误响应">
            <JsonEditor v-model="formData.responseError" />
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <div class="form-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useApiStore } from '../stores/api';
import { HTTP_METHODS, type HttpMethod } from '../types';
import JsonEditor from '../components/common/JsonEditor.vue';

const route = useRoute();
const router = useRouter();
const apiStore = useApiStore();

const apiId = computed(() => Number(route.params.apiId));
const projectId = computed(() => Number(route.params.id));

const formData = reactive({
  name: '',
  method: 'GET' as HttpMethod,
  path: '',
  description: '',
  requestHeaders: null as Record<string, string> | null,
  requestParams: null as Record<string, unknown> | null,
  requestBody: null as unknown,
  responseSuccess: null as unknown,
  responseError: null as unknown,
});

onMounted(async () => {
  const api = await apiStore.getApi(apiId.value);
  if (api) {
    apiStore.setCurrentApi(api);
    formData.name = api.name;
    formData.method = api.method;
    formData.path = api.path;
    formData.description = api.description ?? '';
    formData.requestHeaders = api.requestHeaders ?? null;
    formData.requestParams = api.requestParams ?? null;
    formData.requestBody = api.requestBody ?? null;
    formData.responseSuccess = api.responseSuccess ?? null;
    formData.responseError = api.responseError ?? null;
  }
});

function goBack() {
  router.push({ name: 'api-list', params: { id: projectId.value } });
}

async function handleSave() {
  try {
    await apiStore.updateApi(apiId.value, projectId.value, {
      name: formData.name,
      method: formData.method,
      path: formData.path,
      description: formData.description || undefined,
      requestHeaders: formData.requestHeaders ?? undefined,
      requestParams: formData.requestParams ?? undefined,
      requestBody: formData.requestBody ?? undefined,
      responseSuccess: formData.responseSuccess ?? undefined,
      responseError: formData.responseError ?? undefined,
    });
    ElMessage.success('保存成功');
    goBack();
  } catch (error) {
    ElMessage.error(String(error));
  }
}
</script>

<style scoped>
.api-detail-view {
  padding: 20px;
}

.page-header {
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

.basic-info,
.request-info,
.response-info {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
