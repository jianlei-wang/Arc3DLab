<script setup lang="ts">
import { shallowRef, markRaw } from 'vue';
import GraphView from '@/components/examples/graph/GraphView.vue';
import DockablePanelExample from '@/components/examples/DockablePanelExample.vue';

defineOptions({ name: '侧边栏', inheritAttrs: false });

const activeComponent = shallowRef(markRaw(GraphView));

const menuItems = [
  { id: 4, name: '停靠面板', component: DockablePanelExample }
];

const switchComponent = (component: any) => {
  activeComponent.value = markRaw(component);
};
</script>

<template>
  <div class="side-bar-main border-r">
    <div class="side-bar-menu">
      <div v-for="item in menuItems" :key="item.id" class="menu-item"
        :class="{ active: activeComponent === item.component }" @click="switchComponent(item.component)">
        {{ item.name }}
      </div>
    </div>
    <div class="side-bar-content">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-bar-main {
  width: 200px;
  height: 100%;
  background: #f5f5f5;
  display: flex;

  .side-bar-menu {
    width: 60px;
    background: #e0e0e0;
    display: flex;
    flex-direction: column;

    .menu-item {
      padding: 15px 5px;
      text-align: center;
      cursor: pointer;
      border-bottom: 1px solid #ccc;
      font-size: 12px;

      &.active {
        background: #409eff;
        color: white;
      }

      &:hover:not(.active) {
        background: #d0d0d0;
      }
    }
  }

  .side-bar-content {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  }
}
</style>