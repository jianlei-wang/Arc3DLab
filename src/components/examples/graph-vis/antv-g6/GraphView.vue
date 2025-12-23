<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { Graph, type GraphData } from '@antv/g6';

import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { handleSourceDatas, query } from './GraphView';
import { initGraphEvents } from './GraphEvents';
defineOptions({ name: '知识图谱', inheritAttrs: false });

const handleQueryResult = (event: CustomEvent) => {
  console.log('出发了：', event);
  const { detail = [] } = event;
  drawGraph(detail);
};
onBeforeMount(() => {
  window.addEventListener(
    'graphQueryResult',
    handleQueryResult as EventListener
  );
});

const containerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  initGraph();
});

function initGraph() {
  handleSourceDatas();
  query('舰船');
}
let graph: Graph | null = null;
function drawGraph(datas: GraphData) {
  graph && graph.destroy();
  graph = null;
  if (containerRef.value) {
    const dom = containerRef.value;
    console.log(dom);
    const width = dom.clientWidth;
    const height = dom.clientHeight;
    graph = new Graph({
      container: containerRef.value!,
      width: width,
      height: height,
      data: datas,
      // animation: false,
      autoFit: {
        type: 'view', // 自适应类型：'view' 或 'center'
        animation: {
          // 自适应动画效果
          duration: 100, // 动画持续时间(毫秒)
          easing: 'ease-in-out', // 动画缓动函数
        },
      },
      renderer: (_layer) => {
        return new CanvasRenderer();
      },
      layout: {
        type: 'force',
        workerEnabled: true, // 使用WebWorker
      },
      edge: {
        state: {
          highlight: {
            stroke: '#D580FF',
          },
        },
      },
      behaviors: [
        {
          type: 'drag-element',
          enableOptimize: true, // 关键！启用优化
        },
        {
          type: 'hover-activate',
          enable: (event: any) => event.targetType === 'node',
          degree: 1,
          state: 'highlight',
        },
        'drag-canvas',
        'zoom-canvas',
      ],
    });

    graph.render();
    initGraphEvents(graph);
  }
}
</script>
<template>
  <div class="graph-main">
    <div ref="containerRef" class="graph-container"></div>
  </div>
</template>
<style lang="scss" scoped>
.graph-main {
  flex: 1 1 auto;
  height: 0;

  .graph-container {
    width: 100%;
    height: 100%;
  }
}
</style>
