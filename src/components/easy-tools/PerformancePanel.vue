<script setup lang="ts">
import Stats from 'stats.js';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

defineOptions({ name: '性能面板', inheritAttrs: false });

const statsRef = ref<HTMLElement | null>(null);

const getSidebarWidth = () => {
  const doms = document.getElementsByClassName('side-bar-main');
  return doms.length > 0 ? doms[0]!.clientWidth + 1 : 1;
};

const updatePanelPosition = () => {
  const newWidth = getSidebarWidth();
  if (statsRef.value) {
    statsRef.value.style.left = `${newWidth}px`;
  }
};

onMounted(() => {
  updatePanelPosition();
  // 监听窗口大小变化事件
  window.addEventListener('resize', updatePanelPosition);

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

onUnmounted(() => {
  // 组件卸载时移除事件监听器
  window.removeEventListener('resize', updatePanelPosition);
});
</script>
<template>
  <div class="performance-panel" ref="statsRef"></div>
</template>
<style lang="scss" scoped>
.performance-panel {
  position: absolute;
  top: 101px;
  display: flex;
  :deep(.stats-item) {
    position: initial !important;
    z-index: 1 !important;
  }
}
</style>
