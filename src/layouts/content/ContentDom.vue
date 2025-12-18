<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import SideBar from './SideBar.vue';
import { initMap } from '@/utils/cesium/InitMap';
import {
  removeDockedPanel,
  getDockedPanels,
  getActivePanel,
  getPanelContents,
  getShowDockPreview,
  getShowUnifiedCloseButton,
  initializeDockPanelGlobals,
  setExternalRefUpdater,
} from '@/utils/PanelDock';

defineOptions({ name: '关键视图', inheritAttrs: false });

// 获取停靠面板相关数据的响应式引用
const dockedPanels = ref(getDockedPanels());
const activePanel = ref(getActivePanel());
const panelContents = ref(getPanelContents());
const showDockPreview = ref(getShowDockPreview());

// 计算是否显示统一关闭按钮
const showUnifiedCloseButton = computed(() => getShowUnifiedCloseButton());

onMounted(() => {
  window.viewer = initMap('map-container');
  // 设置外部引用更新函数
  setExternalRefUpdater(() => {
    dockedPanels.value = getDockedPanels();
    activePanel.value = getActivePanel();
    panelContents.value = getPanelContents();
    showDockPreview.value = getShowDockPreview();
  });
  // 初始化全局函数
  initializeDockPanelGlobals();
});

// 切换激活面板
const setActivePanel = (panel: any) => {
  activePanel.value = panel;
};
</script>

<template>
  <div class="content-dom-main border-t border-b">
    <SideBar />
    <div class="map-container-wrapper">
      <div id="map-container"></div>

      <!-- 停靠预览区域 -->
      <div v-show="showDockPreview" class="dock-preview"></div>

      <!-- 停靠面板容器 -->
      <div v-if="dockedPanels.length > 0" class="docked-panel">
        <div class="panel-header">
          <div class="panel-tabs">
            <div
              v-for="panel in dockedPanels"
              :key="panel.id"
              class="panel-tab"
              :class="{ active: panel.id === activePanel?.id }"
              @click="setActivePanel(panel)"
            >
              {{ panel.title }}
              <!-- 多个面板时显示各自的关闭按钮 -->
              <button
                v-if="!showUnifiedCloseButton"
                class="close-btn"
                @click.stop="removeDockedPanel(panel.id)"
              >
                ×
              </button>
            </div>
          </div>
          <!-- 单个面板时显示统一关闭按钮 -->
          <button
            v-if="showUnifiedCloseButton"
            class="close-btn"
            @click="activePanel && removeDockedPanel(activePanel.id)"
          >
            ×
          </button>
        </div>
        <div class="panel-content">
          <!-- 显示当前激活面板的内容 -->
          <div
            v-for="panel in dockedPanels"
            :key="panel.id"
            v-show="panel.id === activePanel?.id"
          >
            <div
              v-if="
                panelContents &&
                panelContents.get &&
                panelContents.get(panel.id)
              "
              v-html="panelContents.get(panel.id)"
            ></div>
            <div v-else-if="panel.content" v-html="panel.content"></div>
            <div v-else>{{ panel.title }} 内容区域</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-dom-main {
  width: 100%;
  flex: 1 1 auto;
  height: 0;
  background: green;
  display: flex;

  .map-container-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;

    #map-container {
      flex: 1;
      transition: width 0.3s ease;
    }

    // 停靠预览区域
    .dock-preview {
      position: absolute;
      right: 0;
      top: 0;
      width: 400px;
      height: 100%;
      background: rgba(64, 158, 255, 0.1);
      border: 2px dashed var(--ev-border-light);
      z-index: 1000;
      pointer-events: none;
    }

    .docked-panel {
      width: 400px;
      height: 100%;
      background: var(--ev-back-color);
      border-left: 1px solid var(--ev-border-color);
      display: flex;
      flex-direction: column;
      z-index: 100;

      .panel-header {
        background: var(--ev-back-primary);
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .panel-tabs {
          display: flex;
          flex: 1;
          overflow-x: auto;

          .panel-tab {
            padding: 4px 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            position: relative;
            letter-spacing: 1px;
            column-gap: 5px;
            overflow-x: auto;
            &.active {
              border-bottom: 2px solid var(--ev-border-active);
              color: var(--ev-color-active);
              font-weight: bold;
              background: #004b6d;
            }

            &:hover:not(.active) {
              background: rgba(255, 255, 255, 0.1);
            }

            .close-btn {
              font-size: 18px;
              width: 18px;
              height: 18px;
              line-height: 18px;
            }
          }
        }
      }

      .panel-content {
        flex: 1 1 auto;
        height: 0;
        padding: 15px;
      }
    }
  }
}
</style>
