<script setup lang="ts">
import DockablePanel from '@/components/dock-panel/DockablePanel.vue';
import DemoCollapse from './DemoCollapse.vue';
import { onPanelClose, onPanelDock } from '@/utils/PanelDock';
import { ref, watch } from 'vue';

defineOptions({ inheritAttrs: false, name: '示例库组件' });

const props = defineProps({
  visible: { type: Boolean, default: true },
  // 添加一个属性来标识是否作为停靠面板使用
  isDocked: { type: Boolean, default: false }
});

const activeNames = ref('1');

// 监听activeNames的变化，确保状态可以正确更新
watch(activeNames, (newVal) => {
  console.log('activeNames changed:', newVal);
});

const emits = defineEmits(['update:visible']);
function close() {
  emits('update:visible', false);
  onPanelClose('示例库');
}
</script>

<template>
  <!-- 如果是停靠面板，则直接渲染内容，否则使用DockablePanel -->
  <div v-if="isDocked">
    <DemoCollapse />
  </div>
  <DockablePanel v-else :visible="props.visible" title="示例库" :width="800" :height="600" @close="close"
    @dock="onPanelDock('示例库', $event)" @update:visible="emits('update:visible', $event)">
    <DemoCollapse />
  </DockablePanel>
</template>

<style lang="scss" scoped>
// 样式已移到DemoCollapse.vue中</style>