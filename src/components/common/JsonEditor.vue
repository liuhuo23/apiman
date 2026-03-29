<template>
  <div class="json-editor">
    <el-input
      v-model="jsonString"
      type="textarea"
      :rows="10"
      placeholder="输入 JSON 或留空"
      @blur="handleBlur"
    />
    <div v-if="parseError" class="error">{{ parseError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: unknown;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: unknown];
}>();

const jsonString = ref('');
const parseError = ref('');

watch(
  () => props.modelValue,
  (val) => {
    jsonString.value = val ? JSON.stringify(val, null, 2) : '';
  },
  { immediate: true }
);

function handleBlur() {
  if (!jsonString.value.trim()) {
    emit('update:modelValue', null);
    parseError.value = '';
    return;
  }
  try {
    const parsed = JSON.parse(jsonString.value);
    emit('update:modelValue', parsed);
    parseError.value = '';
  } catch (e) {
    parseError.value = 'Invalid JSON';
  }
}
</script>

<style scoped>
.json-editor {
  width: 100%;
}

.error {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
</style>
