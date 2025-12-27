<script setup lang="ts">
import DockablePanel from '@/components/dock-panel/DockablePanel.vue';
import { reactive, ref, onBeforeMount, onMounted, computed } from 'vue';
import AddModel from './data-source/AddModel.vue';
defineOptions({ name: '数据源加载组件', inheritAttrs: false });
const tools = ref([
  { id: '3dtiles', title: 'add.3dtiles', icon: 'icon-3dtiles' },
  { id: 'gltf', title: 'add.gltf', icon: 'icon-gltf' },
]);
const toolImg = (icon: string) => {
  return new URL(`../../../assets/images/menu/${icon}.png`, import.meta.url)
    .href;
};
const activeItem = ref<any>(null);
const boolShow = computed<boolean>({
  get() {
    return activeItem.value ? true : false;
  },
  set(val) {
    activeItem.value = val ? activeItem.value : null;
  },
});
function onClick(item: any) {
  activeItem.value = item;
}
</script>
<template>
  <div class="data-source-main">
    <img
      v-for="item in tools"
      :key="item.id"
      :src="toolImg(item.icon)"
      alt=""
      :title="$t(item.title)"
      @click="onClick(item)"
    />
  </div>
  <DockablePanel
    v-model:visible="boolShow"
    :title="$t(activeItem?.title || 'undefined')"
    :dockable="false"
    :height="450"
  >
    <AddModel></AddModel>
  </DockablePanel>
</template>
<style lang="scss" scoped>
.data-source-main {
  display: flex;
  align-items: center;
  column-gap: 3px;
  img {
    width: 22px;
    height: 22px;
    cursor: pointer;
  }
}
</style>
