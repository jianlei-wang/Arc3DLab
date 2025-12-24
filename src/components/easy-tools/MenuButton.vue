<script setup lang="ts">
import { reactive, ref, onBeforeMount, onMounted, watch } from 'vue';

defineOptions({ name: '菜单栏按钮组件_多类型', inheritAttrs: false });

const props = defineProps({
  type: { type: String, default: 'label' },
  label: { type: String, default: '' },
});
const emits = defineEmits(['change']);

const model = defineModel();
watch(model, (value) => {
  emits('change', value);
});
</script>
<template>
  <div class="menu-button-main">
    <el-checkbox
      v-if="type === 'checkbox'"
      :label="label"
      size="small"
      v-model="model"
    />
    <span v-else>{{ label }}</span>
  </div>
</template>
<style lang="scss" scoped>
.menu-button-main {
  :deep(.el-checkbox) {
    .el-checkbox__label {
      color: var(--ev-color-white);
      font-size: 14px !important;
    }
  }
}
</style>
