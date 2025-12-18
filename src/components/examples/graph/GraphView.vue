<script setup lang="ts">
import { graphSourceData } from '@/api/graph';
import { ref, onMounted, onUnmounted, onBeforeMount } from 'vue';
import { initGraphDatas } from './GraphView';

defineOptions({ name: '图形视图示例', inheritAttrs: false });

onBeforeMount(() => {
  loadZoomCharts();
});
function initData() {
  graphSourceData().then((res) => {
    graphDatas.value = initGraphDatas(res.data);
    initializeChart();
  });
}

const chartContainer = ref<HTMLDivElement | null>(null);
let chartInstance: any = null;

const graphDatas = ref<any>({});

onMounted(() => {
  // 加载 zoomCharts 脚本
  // loadZoomCharts();
});

onUnmounted(() => {
  // 销毁图表实例
  if (chartInstance) {
    chartInstance.destroy();
  }
});

function loadZoomCharts() {
  // 创建许可证脚本
  const licenseScript = document.createElement('script');
  licenseScript.textContent = `
    var ZoomChartsLicense = 'ZCF-1: Internal license for use only by SIA Data Visualization Software Lab developers',
        ZoomChartsLicenseKey = '806e1e733880cbaf9624abca1d3080d2af0fe82ffc93b2889f11438fdcd99fee52ab160d6efa5b543fc561d50598bdb2e5486e8b59f0cdb7ffaa59cb3c97aaf72838ac446af4fdf7071dc5abf56fc441a00df3adb061aa0afb05eff90d52ea727e904ecfa835631d64d72e8109f2f5b77d3d3261d25a943d31ab692b7ab4418e7067150076152f6946954b3b76ab083f97c8c0e3168531c78835748b384336d0cb3a0e284ec33c67d3789ae06e2cb7c554ac5f62cd29d24b90c07c6c93d59dd678bcac5b4d8cbb45ba4d15359a1c72b36cb60d541c8787c5cbc566daeccca137439dabcd2208c5f0baa83c504658d43ddc69f6276eaf645d7c99101c46ae9bd9';
  `;
  document.head.appendChild(licenseScript);

  // 动态加载 zoomCharts
  const script = document.createElement('script');
  script.src = '/zoomcharts/zoomcharts.js';
  script.onload = () => {
    console.log('zoomCharts loaded');
  };
  script.onerror = () => {
    console.error('Failed to load zoomCharts');
  };
  document.head.appendChild(script);
}

function initializeChart() {
  if (!chartContainer.value || !window.ZoomCharts) return;
  chartInstance && chartInstance.destroy && chartInstance.destroy();
  // 创建图表配置
  const chartConfig = {
    container: chartContainer.value,
    data: [{ preloaded: graphDatas.value }],
    area: { height: chartContainer.value.clientHeight },

    style: {
      node: {
        display: 'image',
        lineWidth: 2,
        lineColor: '#2fc32f',
        imageCropping: true,
        radius: 42,
      },
      nodeStyleFunction: function (node: any) {
        node.display = node.data.image ? 'image' : '';
        node.lineColor = node.data.lineColor;
        node.aura = node.data.auras;
        node.image = node.data.image;
        node.label = node.data.name;
      },
      linkStyleFunction: function (link: any) {
        link.fillColor = '#000000';
        link.label = link.data.type;
      },
    },
    interaction: {
      resizing: {
        enabled: false,
      },
    },
    navigation: {
      mode: 'focusnodes', // "manual", "showall" or "focusnodes"
      initialNodes: [graphDatas.value.nodes[0].id], // list of nodes
      focusNodeExpansionRadius: 2,
      focusNodeTailExpansionRadius: 0.3,
      numberOfFocusNodes: 2,
      expandOnClick: true,
    },
  };

  // 创建图表实例
  chartInstance = new window.ZoomCharts.NetChart(chartConfig);
}
</script>

<template>
  <div class="graph-view">
    <div ref="chartContainer" class="chart-container"></div>
    <div>
      <button @click="initData">加载图表</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.graph-view {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  h2 {
    margin-top: 0;
    color: #333;
  }

  p {
    color: #666;
    line-height: 1.6;
  }

  .chart-container {
    flex: 1;
    min-height: 500px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 10px 0;
  }
}
</style>
