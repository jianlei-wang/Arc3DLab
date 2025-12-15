<script setup lang="ts">
import ContentDom from './content/ContentDom.vue';
import MenuBar from './menu/MenuBar.vue';
import StatusBar from './status/StatusBar.vue';

defineOptions({ name: '布局入口', inheritAttrs: false });
</script>
<template>
  <div class="layout-main">
    <MenuBar />
    <ContentDom />
    <StatusBar />
  </div>
</template>
<style lang="scss" scoped>
.layout-main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #be8484;
}
</style>
