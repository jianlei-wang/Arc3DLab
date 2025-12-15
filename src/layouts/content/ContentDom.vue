<script setup lang="ts">
import { onMounted } from 'vue';
import SideBar from './SideBar.vue';
import { initMap } from '@/utils/cesium/InitMap';

defineOptions({ name: '关键视图', inheritAttrs: false });
onMounted(() => {
  window.viewer = initMap('map-container');
});
</script>
<template>
  <div class="content-dom-main border-t border-b">
    <SideBar />
    <div id="map-container"></div>
  </div>
</template>
<style lang="scss" scoped>
.content-dom-main {
  width: 100vw;
  flex: 1 1 auto;
  height: 0;
  background: green;
  display: flex;
  #map-container {
    flex: 1;
  }
}
</style>
