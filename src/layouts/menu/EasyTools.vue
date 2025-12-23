<script setup lang="ts">
import { reactive, ref, onBeforeMount, onMounted } from 'vue';
import PerformancePanel from '@/components/easy-tools/PerformancePanel.vue';
defineOptions({ name: '快捷工具', inheritAttrs: false });

const statsForm = reactive({
  a: false,
  b: false,
  c: false,
});
</script>
<template>
  <div class="easy-tools-main">
    <div class="easy-tools-content"></div>
  </div>
  <Teleport to="body">
    <PerformancePanel />
  </Teleport>
</template>
<style lang="scss" scoped>
.easy-tools-main {
  flex: 1;
}
</style>
