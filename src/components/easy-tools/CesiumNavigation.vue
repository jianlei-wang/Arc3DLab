<script setup lang="ts">
import CesiumNavigation from 'cesium-navigation-es6';
import { onMounted, onBeforeUnmount } from 'vue';
defineOptions({ inheritAttrs: false, name: '组件名称' });
let navigationBar: any;
onMounted(() => {
  const options: any = {};
  // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass = true;
  // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls = true;
  // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend = true;
  // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing = true;
  navigationBar = new CesiumNavigation(window.viewer, options);
});
onBeforeUnmount(() => {
  navigationBar && navigationBar.destroy();
});
</script>
<template></template>
<style lang="scss">
#navigationDiv {
  .navigation-controls {
    background: #3a4347;
    border: 1px solid #b0b9bdaa;
  }
}
</style>
