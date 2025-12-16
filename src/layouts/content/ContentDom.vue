<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import SideBar from './SideBar.vue';
import { initMap } from '@/utils/cesium/InitMap';
import DockedPanelContent from '@/components/DockedPanelContent.vue';

defineOptions({ name: '关键视图', inheritAttrs: false });

const dockedPanels = ref<any[]>([]); // 存储停靠的面板
const activePanel = ref<any>(null); // 当前激活的面板
const showDockPreview = ref(false); // 显示停靠预览

onMounted(() => {
  window.viewer = initMap('map-container');
});

// 添加停靠面板的方法
const addDockedPanel = (panel: any) => {
  dockedPanels.value.push(panel);
  // 自动激活新添加的面板
  activePanel.value = panel;
};

// 移除停靠面板的方法
const removeDockedPanel = (panelId: string) => {
  const index = dockedPanels.value.findIndex(p => p.id === panelId);
  if (index > -1) {
    dockedPanels.value.splice(index, 1);
    if (activePanel.value && activePanel.value.id === panelId) {
      activePanel.value = dockedPanels.value.length > 0 ? dockedPanels.value[0] : null;
    }
  }
};

// 切换激活面板
const setActivePanel = (panel: any) => {
  activePanel.value = panel;
};

// 根据面板标题设置激活面板
const setActivePanelByTitle = (panelTitle: string) => {
  const panel = dockedPanels.value.find(p => p.title === panelTitle);
  if (panel) {
    activePanel.value = panel;
  }
};

// 扩展 Window 接口
declare global {
  interface Window {
    addDockedPanel: (panel: any) => void;
    removeDockedPanel: (panelId: string) => void;
    showDockingPreview: () => void;
    hideDockingPreview: () => void;
    setActiveDockedPanel?: (panelTitle: string) => void;
  }
}

// 提供给全局使用
window.addDockedPanel = addDockedPanel;
window.removeDockedPanel = removeDockedPanel;
window.setActiveDockedPanel = setActivePanelByTitle;

// 显示停靠预览
const showDockingPreview = () => {
  showDockPreview.value = true;
};

// 隐藏停靠预览
const hideDockingPreview = () => {
  showDockPreview.value = false;
};

// 提供给全局使用停靠预览方法
window.showDockingPreview = showDockingPreview;
window.hideDockingPreview = hideDockingPreview;

// 计算是否显示统一关闭按钮
const showUnifiedCloseButton = computed(() => {
  return dockedPanels.value.length === 1;
});
</script>

<template>
  <div class="content-dom-main border-t border-b">
    <SideBar />
    <div class="map-container-wrapper">
      <div id="map-container"></div>
      
      <!-- 停靠预览区域 -->
      <div 
        v-show="showDockPreview" 
        class="dock-preview"
      ></div>
      
      <!-- 停靠面板容器 -->
      <div 
        v-if="dockedPanels.length > 0"
        class="docked-panel"
      >
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
                class="tab-close-btn" 
                @click.stop="removeDockedPanel(panel.id)"
              >×</button>
            </div>
          </div>
          <!-- 单个面板时显示统一关闭按钮 -->
          <button 
            v-if="showUnifiedCloseButton" 
            class="close-btn" 
            @click="removeDockedPanel(activePanel.id)"
          >×</button>
        </div>
        <div class="panel-content">
          <!-- 显示当前激活面板的内容 -->
          <DockedPanelContent :panel-type="activePanel?.title" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-dom-main {
  width: 100vw;
  flex: 1 1 auto;
  height: 0;
  background: green;
  display: flex;
  
  .map-container-wrapper {
    flex: 1;
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
      border: 2px dashed #409eff;
      z-index: 999;
      pointer-events: none;
    }
    
    .docked-panel {
      width: 400px;
      height: 100%;
      background: #fff;
      border-left: 1px solid #ddd;
      display: flex;
      flex-direction: column;
      box-shadow: -2px 0 5px rgba(0,0,0,0.1);
      z-index: 100;
      
      .panel-header {
        background: linear-gradient(0deg, #1f201d 0%, #046cef 100%);
        color: white;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .panel-tabs {
          display: flex;
          flex: 1;
          overflow-x: auto;
          
          .panel-tab {
            padding: 4px 12px;
            cursor: pointer;
            border-radius: 3px;
            margin-right: 5px;
            display: flex;
            align-items: center;
            position: relative;
            
            &.active {
              background: rgba(255,255,255,0.2);
            }
            
            &:hover:not(.active) {
              background: rgba(255,255,255,0.1);
            }
            
            .tab-close-btn {
              background: none;
              border: none;
              color: white;
              font-size: 16px;
              cursor: pointer;
              width: 18px;
              height: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              margin-left: 5px;
              
              &:hover {
                background-color: rgba(255, 255, 255, 0.2);
              }
            }
          }
        }
        
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          
          &:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
        }
      }
      
      .panel-content {
        flex: 1;
        overflow: auto;
      }
    }
  }
}
</style>