<script setup lang="ts">
import {
  ref,
  onUnmounted,
  onBeforeMount,
  watch,
  computed,
  nextTick,
} from 'vue';
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue';
import { destroyChart, loadZoomCharts, query } from './GraphView';
import { Search } from '@element-plus/icons-vue';

defineOptions({ name: '图形视图示例', inheritAttrs: false });
const handleQueryResult = (event: CustomEvent) => {
  dateInfo.value = event.detail;
};
onBeforeMount(() => {
  loadZoomCharts();
  window.addEventListener(
    'graphQueryResult',
    handleQueryResult as EventListener
  );
});

const searchQuery = ref('');
function startQuery() {
  query(searchQuery.value);
}

// Collapsed state for each section
const collapsedState = ref({
  currentNode: false, // 当前节点 - expanded by default
  nodeDetails: true, // 节点详情 - collapsed by default
  statistics: false, // 统计信息 - expanded by default
});

// Pie chart reference
const pieChartRef = ref<HTMLDivElement | null>(null);
let pieChartInstance: any = null;

// Toggle collapse state
function toggleCollapse(section: 'currentNode' | 'nodeDetails' | 'statistics') {
  collapsedState.value[section] = !collapsedState.value[section];
}

// Get color by index for consistent coloring between tags and chart
function getColorByIndex(index: number): string {
  const colors = [
    '#FF6B6B80',
    '#4ECDC480',
    '#45B7D180',
    '#96CEB480',
    '#FFEAA780',
    '#DDA0DD80',
    '#98D8C880',
    '#F7DC6F80',
    '#BB8FCE80',
    '#85C1E980',
    '#F8C47180',
    '#82E0AA80',
    '#F1948A80',
    '#85C1E980',
    '#D7BDE280',
  ];
  return colors[index % colors.length];
}

const dateInfo = ref<any>();

const curNode: any = computed(() => {
  if (dateInfo.value && dateInfo.value.clickNode) {
    const { data } = dateInfo.value.clickNode;
    return data.attribute || data;
  } else {
    return undefined;
  }
});

const nodestatistic = computed(() => {
  if (dateInfo.value && dateInfo.value.nodes) {
    return groupBy(dateInfo.value.nodes, 'icon');
  } else {
    return undefined;
  }
});
function groupBy(arr, key) {
  return arr.reduce((acc, obj) => {
    const groupKey = obj[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(obj);
    return acc;
  }, {});
}

// Render pie chart with consistent colors
function renderPieChart() {
  if (!pieChartRef.value || !nodestatistic.value) return;

  // Check if ZoomCharts is available
  if (!window.ZoomCharts) {
    return;
  }

  // Check if nodestatistic has data
  const statKeys = Object.keys(nodestatistic.value);
  if (statKeys.length === 0) return;

  // Prepare data for the chart
  const chartData = [];
  const chartColors = [];
  let index = 0;

  for (const [key, value] of Object.entries(nodestatistic.value)) {
    chartData.push({
      id: key,
      name: key,
      value: Array.isArray(value) ? value.length : 0,
      style: { expandable: false },
    });
    chartColors.push(getColorByIndex(index));
    index++;
  }

  // Create complete data structure matching ZoomCharts example
  const completeData = {
    subvalues: chartData,
  };

  // Chart configuration - 根据项目规范实现3D效果和白色样式
  const config = {
    theme: window.ZoomCharts.PieChart.themes.raised, // 使用raised主题增强3D效果
    container: pieChartRef.value,
    data: {
      preloaded: completeData,
    },
    labels: {
      enabled: false, // 禁用标签、牵引线和文字
    },
    legend: {
      enabled: false, // 根据用户需求禁用图例
    },
  };

  // Always recreate chart to ensure proper data refresh and avoid update errors
  try {
    if (pieChartInstance) {
      // 安全地销毁图表实例
      if (typeof pieChartInstance.dispose === 'function') {
        pieChartInstance.dispose();
      } else if (typeof pieChartInstance.destroy === 'function') {
        // 某些版本的ZoomCharts可能使用destroy方法
        pieChartInstance.destroy();
      }
      pieChartInstance = null;
    }
    // Create new chart instance
    pieChartInstance = new window.ZoomCharts.PieChart(config);
  } catch (error) {
    console.error('Error creating pie chart:', error);
  }
}

// Watch for changes in nodestatistic and re-render chart
watch(nodestatistic, () => {
  nextTick(() => {
    renderPieChart();
  });
});

// Force refresh chart when needed
function refreshPieChart() {
  if (pieChartInstance) {
    // 安全地销毁图表实例
    if (typeof pieChartInstance.dispose === 'function') {
      pieChartInstance.dispose();
    } else if (typeof pieChartInstance.destroy === 'function') {
      // 某些版本的ZoomCharts可能使用destroy方法
      pieChartInstance.destroy();
    }
    pieChartInstance = null;
  }
  nextTick(() => {
    renderPieChart();
  });
}

// Get content length class for adaptive layout
function getContentLengthClass(value: any): string {
  if (value === null || value === undefined) {
    return 'short-content';
  }

  const strValue = String(value);
  if (strValue.length > 50) {
    return 'long-content';
  } else if (strValue.length > 20) {
    return 'medium-content';
  }
  return 'short-content';
}

// Parse base object for nested form display
function getBaseObject(value: any): Record<string, any> {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return { error: 'Invalid JSON format' };
    }
  }
  return typeof value === 'object' && value !== null ? value : { value };
}

// Filter curNode object based on whether we want bases fields or not
function getFilteredCurNode(includeBases: boolean): Record<string, any> {
  if (!curNode.value) return {};

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(curNode.value)) {
    if (includeBases && key === 'bases') {
      result[key] = value;
    } else if (!includeBases && key !== 'bases') {
      result[key] = value;
    }
  }

  return result;
}

onUnmounted(() => {
  // 销毁图表实例
  destroyChart();

  // 销毁饼图实例
  if (pieChartInstance) {
    // 安全地销毁图表实例
    if (typeof pieChartInstance.dispose === 'function') {
      pieChartInstance.dispose();
    } else if (typeof pieChartInstance.destroy === 'function') {
      // 某些版本的ZoomCharts可能使用destroy方法
      pieChartInstance.destroy();
    }
    pieChartInstance = null;
  }
  window.removeEventListener(
    'graphQueryResult',
    handleQueryResult as EventListener
  );
});
</script>

<template>
  <div class="graph-view">
    <div class="charts-box">
      <div id="chartContainer" class="chart-container"></div>
      <div class="tools">
        <div class="search-box">
          <span>关键字：</span>
          <el-input v-model="searchQuery" placeholder="请输入" size="small">
            <template #append>
              <el-button link :icon="Search" size="small" @click="startQuery" />
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="date-info">
      <div class="di-info">
        <div class="di-node">
          <div class="form-header" @click="toggleCollapse('currentNode')">
            <el-icon class="collapse-icon">
              <ArrowDown v-if="!collapsedState.currentNode" />
              <ArrowRight v-else />
            </el-icon>
            当前节点
          </div>
          <div v-if="!collapsedState.currentNode" class="adaptive-form">
            <!-- Regular fields (excluding 'bases') -->
            <div
              v-if="curNode"
              v-for="(value, key) in getFilteredCurNode(false)"
              :key="key"
              :class="['form-item', getContentLengthClass(value)]"
            >
              <div class="form-label">{{ key }}：</div>
              <div class="form-value">
                <img
                  v-if="key === 'image'"
                  :src="value"
                  alt="image"
                  width="35px"
                  height="35px"
                />
                <div v-else>{{ value }}</div>
              </div>
            </div>
            <div v-else class="no-data">暂无节点信息</div>
          </div>
        </div>
        <div class="di-more">
          <div class="form-header" @click="toggleCollapse('nodeDetails')">
            <el-icon class="collapse-icon">
              <ArrowDown v-if="!collapsedState.nodeDetails" />
              <ArrowRight v-else />
            </el-icon>
            节点详情
          </div>
          <!-- Bases field displayed separately in node details -->
          <div
            v-for="(value, key) in getFilteredCurNode(true)"
            :key="key"
            class="base-form-wrapper"
            v-show="!collapsedState.nodeDetails"
          >
            <div class="base-form-content">
              <div
                v-for="(baseValue, baseKey) in getBaseObject(value)"
                :key="baseKey"
                :class="['form-item', getContentLengthClass(baseValue)]"
              >
                <div class="form-label">{{ baseKey }}：</div>
                <div class="form-value">{{ baseValue }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="di-statistic">
          <div class="form-header" @click="toggleCollapse('statistics')">
            <el-icon class="collapse-icon">
              <ArrowDown v-if="!collapsedState.statistics" />
              <ArrowRight v-else />
            </el-icon>
            统计信息
          </div>
          <div class="stats-content" v-show="!collapsedState.statistics">
            <div v-if="nodestatistic">
              <!-- Tags section -->
              <div class="si-tags">
                <span
                  v-for="(value, key, index) in nodestatistic"
                  :key="key"
                  class="si-tag"
                  :style="{ backgroundColor: getColorByIndex(index) }"
                >
                  <span>{{ key }}: {{ value.length }}</span>
                </span>
              </div>

              <!-- Pie chart section -->
              <div ref="pieChartRef" class="chart-pie"></div>
            </div>
            <div v-else class="no-data">暂无统计信息</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.graph-view {
  height: 100%;
  width: 100%;
  display: flex;
  column-gap: 5px;
  .charts-box {
    flex: 1;
    position: relative;
    border: 1px solid #86868680;
    border-radius: 4px;
    .tools {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      padding: 10px;
      .search-box {
        display: flex;
        align-items: center;
        .el-input {
          flex: 1;
        }
      }
    }
    .chart-container {
      width: 100%;
      height: 100%;
    }
  }
  .date-info {
    display: flex;
    flex-direction: column;
    width: 350px;
    height: 100%;
    overflow-y: auto;

    .form-header {
      font-weight: bold;
      padding: 10px;
      background: linear-gradient(0deg, #1f201d 0%, #046cef 100%);
      border-radius: 6px 6px 0px 0px;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;

      .collapse-icon {
        margin-right: 8px;
        transition: transform 0.2s ease;
      }
    }

    .adaptive-form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      padding: 10px;
      max-height: calc(100% - 40px);
    }

    // Responsive behavior for smaller screens
    @media (max-width: 1200px) {
      .adaptive-form,
      .base-form-content {
        grid-template-columns: 1fr;
      }

      .form-item.long-content,
      .form-item.base-item,
      .base-form-wrapper {
        grid-column: span 1;
      }
    }

    .form-item {
      display: flex;
      flex-direction: column;
      padding: 2px 8px;
      background: rgba(71, 83, 117, 0.47);
      border-radius: 4px;
      border: 1px solid #475375;
    }

    .form-item.long-content {
      grid-column: span 2;
    }

    .form-label {
      font-weight: bold;
      margin-bottom: 4px;
      color: #3ba5fc;
    }

    .form-value {
      word-break: break-word;
    }

    .base-form {
      width: 100%;
    }

    .base-form-content {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .base-form-wrapper {
      grid-column: span 2;
      margin-top: 15px;
      border-radius: 4px;
    }

    .di-statistic {
      margin-top: 20px;

      .stats-content {
        padding: 10px;
        min-height: 100px;
      }
    }

    .si-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 15px;

      .si-tag {
        padding: 6px 12px;
        border-radius: 15px;
        color: white;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    .chart-pie {
      width: 100%;
      height: 300px;
    }
  }
}
.no-data {
  color: #999;
  width: 100%;
  display: flex;
  align-items: center;
}

.DVSL-bar-left {
  position: absolute;
}

.zChart-netChart {
  height: 100vh;
  width: 100vw;
}

.zChart-menu {
  background: url('./images/back.png') no-repeat;
  background-size: 100% 100%;
}

.zChart-menu,
.zChart-menu div {
  animation-fill-mode: forwards;
  -moz-animation-iteration-count: 1;
  -webkit-animation-iteration-count: 1;
  -o-animation-iteration-count: 1;
  height: 180px;
  position: absolute;
  width: 180px;
}

.zChart-menu div {
  background: url('./images/sel.png') no-repeat;
  background-size: 100% 100%;
  display: none;
}

.zChart-menu .zChart-menu-sele {
  animation-fill-mode: forwards;
  -moz-animation-iteration-count: 1;
  -webkit-animation-iteration-count: 1;
  -o-animation-iteration-count: 1;
}

.zChart-menu img:hover {
  cursor: pointer;
}
</style>
