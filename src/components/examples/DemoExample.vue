<script setup lang="ts">
import DockablePanel from '@/components/dock-panel/DockablePanel.vue';
import { onPanelClose, onPanelDock } from '@/utils/PanelDock';
import { onBeforeMount, ref } from 'vue';

defineOptions({ inheritAttrs: false, name: '示例库组件' });

const props = defineProps({
  visible: { type: Boolean, default: true },
});

const activeNames = ref('1');

const demoList = [
  {
    id: 'graph-vis',
    title: '知识图谱',
    items: [
      {
        id: 'zoom-charts',
        name: 'zoomCharts网络图',
        component: () =>
          import('@/components/examples/graph-vis/zoom-charts/GraphView.vue'),
      },
    ],
  },
];
const getImg = (pid: string, item: any) => {
  return new URL(`./${pid}/${item.id}/demo.png`, import.meta.url).href;
};

const emits = defineEmits(['update:visible']);
function close() {
  emits('update:visible', false);
  onPanelClose('示例库');
}
</script>
<template>
  <DockablePanel
    :visible="props.visible"
    title="示例库"
    :width="800"
    :height="600"
    @close="close"
    @dock="onPanelDock('示例库', $event)"
    @update:visible="emits('update:visible', $event)"
  >
    <el-collapse class="demo-collapse" v-model="activeNames" accordion>
      <el-collapse-item
        v-for="item in demoList"
        :key="item.id"
        :title="item.title"
        :name="item.id"
      >
        <span v-for="demo in item.items" :key="demo.id">
          <img :src="getImg(item.id, demo)" alt="" />
          <span>{{ demo.name }}</span>
        </span>
      </el-collapse-item>
    </el-collapse>
  </DockablePanel>
</template>
<style lang="scss" scoped>
.demo-collapse {
  padding: 5px 10px;
  :deep(.el-collapse-item) {
    .el-collapse-item__header {
      padding: 0;
    }
  }
}
</style>
