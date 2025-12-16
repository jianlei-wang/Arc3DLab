<template>
  <div class="docked-panel-content">
    <!-- 属性面板内容 -->
    <div v-if="panelType === '属性面板'" class="panel-body">
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
    
    <!-- 图层管理内容 -->
    <div v-else-if="panelType === '图层管理'" class="panel-body">
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
    
    <!-- 分析工具内容 -->
    <div v-else-if="panelType === '分析工具'" class="panel-body">
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
    
    <!-- 默认内容 -->
    <div v-else class="panel-body">
      <p>请选择一个面板查看内容</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  panelType?: string;
}

withDefaults(defineProps<Props>(), {
  panelType: ''
});
</script>

<style lang="scss" scoped>
.docked-panel-content {
  height: 100%;
  padding: 16px;
  overflow: auto;
  
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
}
</style>