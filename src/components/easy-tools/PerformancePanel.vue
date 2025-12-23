<script setup lang="ts">
import Stats from 'stats.js';
import { reactive, ref, onBeforeMount, onMounted, nextTick } from 'vue';

defineOptions({ name: '性能面板', inheritAttrs: false });

const statsRef = ref<HTMLElement | null>(null);

onMounted(() => {
  nextTick(() => {
    const statsFPS = new Stats();
    statsFPS.showPanel(0); // 0: fps
    statsFPS.dom.className = 'stats-item';

    const statsMS = new Stats();
    statsMS.showPanel(1); // 1: ms
    statsMS.dom.className = 'stats-item';

    const statsMB = new Stats();
    statsMB.showPanel(2); // 2: mb
    statsMB.dom.className = 'stats-item';

    statsRef.value?.appendChild(statsFPS.dom);
    statsRef.value?.appendChild(statsMS.dom);
    statsRef.value?.appendChild(statsMB.dom);

    function animate() {
      statsFPS.begin();
      statsFPS.end();

      statsMS.begin();
      statsMS.end();

      statsMB.begin();
      statsMB.end();
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });
});
</script>
<template>
  <div class="performance-panel" ref="statsRef"></div>
</template>
<style lang="scss" scoped>
.performance-panel {
  position: absolute;
  top: 45px;
  right: 2px;
  display: flex;
  :deep(.stats-item) {
    position: initial !important;
  }
}
</style>
