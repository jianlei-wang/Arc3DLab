<template>
  <div class="dockable-panel-example">
    <h2>可停靠面板示例</h2>
    <div class="controls">
      <button @click="openPanel(1)" class="demo-btn">打开属性面板</button>
      <button @click="openPanel(2)" class="demo-btn">打开图层管理</button>
      <button @click="openPanel(3)" class="demo-btn">打开分析工具</button>
      <!-- 不支持贴边的面板示例 -->
      <button @click="openNonDockablePanel" class="demo-btn">打开不可贴边面板</button>
      <!-- 非全屏遮罩面板示例 -->
      <button @click="openNonFullscreenPanel" class="demo-btn">打开非全屏遮罩面板</button>
    </div>
    
    <!-- 可停靠面板1 -->
    <DockablePanel 
      v-model:visible="showPanel1"
      title="属性面板"
      :width="400"
      :height="500"
      :dockable="true"
      :fullscreen-overlay="true"
      @close="onPanelClose('属性面板')"
      @dock="onPanelDock('属性面板', $event)"
    >
      <template #header>
        <div class="custom-header">
          <h3>属性面板</h3>
          <button class="custom-close-btn" @click="showPanel1 = false">×</button>
        </div>
      </template>
      
      <div class="panel-body">
        <h4>对象属性</h4>
        <div class="property-item">
          <label>名称:</label>
          <input type="text" value="要素1" />
        </div>
        <div class="property-item">
          <label>类型:</label>
          <select>
            <option>点</option>
            <option selected>线</option>
            <option>面</option>
          </select>
        </div>
        <div class="property-item">
          <label>颜色:</label>
          <input type="color" value="#409eff" />
        </div>
        <div class="property-item">
          <label>透明度:</label>
          <input type="range" min="0" max="100" value="80" />
        </div>
      </div>
      
      <template #footer>
        <div class="panel-footer-buttons">
          <button class="btn btn-secondary" @click="showPanel1 = false">取消</button>
          <button class="btn btn-primary" @click="applyProperties">应用</button>
        </div>
      </template>
    </DockablePanel>
    
    <!-- 可停靠面板2 -->
    <DockablePanel 
      v-model:visible="showPanel2"
      title="图层管理"
      :width="400"
      :height="500"
      :dockable="true"
      :fullscreen-overlay="true"
      @close="onPanelClose('图层管理')"
      @dock="onPanelDock('图层管理', $event)"
    >
      <div class="panel-body">
        <h4>图层列表</h4>
        <div class="layer-list">
          <div class="layer-item">
            <input type="checkbox" checked />
            <span>基础地图</span>
          </div>
          <div class="layer-item">
            <input type="checkbox" checked />
            <span>道路网络</span>
          </div>
          <div class="layer-item">
            <input type="checkbox" />
            <span>建筑物</span>
          </div>
          <div class="layer-item">
            <input type="checkbox" checked />
            <span>植被覆盖</span>
          </div>
        </div>
      </div>
    </DockablePanel>
    
    <!-- 可停靠面板3 -->
    <DockablePanel 
      v-model:visible="showPanel3"
      title="分析工具"
      :width="400"
      :height="500"
      :dockable="true"
      :fullscreen-overlay="true"
      @close="onPanelClose('分析工具')"
      @dock="onPanelDock('分析工具', $event)"
    >
      <div class="panel-body">
        <h4>空间分析</h4>
        <div class="tool-item">
          <button class="tool-btn">缓冲区分析</button>
        </div>
        <div class="tool-item">
          <button class="tool-btn">叠加分析</button>
        </div>
        <div class="tool-item">
          <button class="tool-btn">网络分析</button>
        </div>
        <div class="tool-item">
          <button class="tool-btn">地形分析</button>
        </div>
      </div>
    </DockablePanel>
    
    <!-- 不可贴边面板 -->
    <DockablePanel 
      v-model:visible="showNonDockablePanel"
      title="不可贴边面板"
      :width="400"
      :height="300"
      :dockable="false"
      :fullscreen-overlay="true"
      @close="onPanelClose('不可贴边面板')"
    >
      <div class="panel-body">
        <h4>这是一个不可贴边的面板</h4>
        <p>这个面板不支持拖拽到右侧边缘进行贴边操作。</p>
        <p>它只能作为一个普通的可拖拽弹窗使用。</p>
      </div>
    </DockablePanel>
    
    <!-- 非全屏遮罩面板 -->
    <DockablePanel 
      v-model:visible="showNonFullscreenPanel"
      title="非全屏遮罩面板"
      :width="400"
       :height="300"
      :dockable="true"
      :fullscreen-overlay="false"
      @close="onPanelClose('非全屏遮罩面板')"
    >
      <div class="panel-body">
        <h4>这是一个非全屏遮罩面板</h4>
        <p>这个面板不会阻止您操作界面的其他部分。</p>
        <p>您可以同时打开多个这样的面板。</p>
      </div>
    </DockablePanel>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import DockablePanel from '../DockablePanel.vue';

const showPanel1 = ref(false);
const showPanel2 = ref(false);
const showPanel3 = ref(false);
const showNonDockablePanel = ref(false);
const showNonFullscreenPanel = ref(false);

// 记录已停靠的面板
const dockedPanels = ref<string[]>([]);

const openPanel = (panelNumber: number) => {
  let panelTitle = '';
  let panelRef: Ref<boolean> | null = null;
  
  switch (panelNumber) {
    case 1:
      panelTitle = '属性面板';
      panelRef = showPanel1;
      break;
    case 2:
      panelTitle = '图层管理';
      panelRef = showPanel2;
      break;
    case 3:
      panelTitle = '分析工具';
      panelRef = showPanel3;
      break;
  }
  
  if (panelRef) {
    // 检查面板是否已经停靠
    if (dockedPanels.value.includes(panelTitle)) {
      // 如果已停靠，激活对应的标签
      if (window.setActiveDockedPanel) {
        window.setActiveDockedPanel(panelTitle);
      }
      return;
    }
    
    // 如果面板已经打开，则不执行任何操作
    if (!panelRef.value) {
      panelRef.value = true;
    }
  }
};

const openNonDockablePanel = () => {
  // 不可贴边面板不能停靠，只需检查是否已打开
  if (!showNonDockablePanel.value) {
    showNonDockablePanel.value = true;
  }
};

const openNonFullscreenPanel = () => {
  // 非全屏遮罩面板不能停靠，只需检查是否已打开
  if (!showNonFullscreenPanel.value) {
    showNonFullscreenPanel.value = true;
  }
};

const onPanelClose = (panelName: string) => {
  console.log(`${panelName}已关闭`);
  
  // 从已停靠面板列表中移除
  const index = dockedPanels.value.indexOf(panelName);
  if (index > -1) {
    dockedPanels.value.splice(index, 1);
  }
};

const onPanelDock = (panelName: string, panelData: any) => {
  console.log(`${panelName}已停靠:`, panelData);
  
  // 将面板添加到已停靠列表
  if (!dockedPanels.value.includes(panelName)) {
    dockedPanels.value.push(panelName);
  }
  
  // 激活新停靠的面板标签
  if (window.setActiveDockedPanel) {
    window.setActiveDockedPanel(panelName);
  }
};

const applyProperties = () => {
  alert('属性已应用！');
  showPanel1.value = false;
};

// 扩展 Window 接口
declare global {
  interface Window {
    setActiveDockedPanel?: (panelTitle: string) => void;
  }
}
</script>

<style lang="scss" scoped>
.dockable-panel-example {
  padding: 20px;
  
  h2 {
    margin-top: 0;
    color: #333;
  }
  
  .controls {
    margin-bottom: 20px;
    
    .demo-btn {
      padding: 10px 20px;
      background-color: #409eff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 10px;
      
      &:hover {
        background-color: #337ecc;
      }
    }
  }
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(0deg, #1f201d 0%, #046cef 100%);
  color: white;
  cursor: move;
}

.custom-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.panel-body {
  h4 {
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .property-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    label {
      width: 80px;
      margin-right: 10px;
    }
    
    input, select {
      flex: 1;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }
  
  .layer-list {
    .layer-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;
      
      input {
        margin-right: 10px;
      }
    }
  }
  
  .tool-item {
    margin-bottom: 10px;
    
    .tool-btn {
      width: 100%;
      padding: 10px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
}

.panel-footer-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &.btn-primary {
    background-color: #409eff;
    color: white;
    
    &:hover {
      background-color: #337ecc;
    }
  }
  
  &.btn-secondary {
    background-color: #6c757d;
    color: white;
    
    &:hover {
      background-color: #5a6268;
    }
  }
}
</style>