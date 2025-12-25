<script setup lang="ts">
import { reactive, ref, onBeforeMount, onMounted } from 'vue';
defineOptions({ name: '数据源加载组件', inheritAttrs: false });
const tools = ref([
  { id: '3dtiles', title: 'add.3dtiles', icon: 'icon-3dtiles' },
  { id: 'gltf', title: 'add.gltf', icon: 'icon-gltf' },
]);
const toolImg = (icon: string) => {
  return new URL(`../../../assets/images/menu/${icon}.png`, import.meta.url)
    .href;
};
</script>
<template>
  <div class="data-source-main">
    <img
      v-for="item in tools"
      :key="item.id"
      :src="toolImg(item.icon)"
      alt=""
      :title="$t(item.title)"
    />
  </div>
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
