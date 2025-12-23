<script setup lang="ts">
import EasyTools from './EasyTools.vue';
import MainMenu from './MainMenu.vue';

defineOptions({ name: '菜单栏', inheritAttrs: false });
</script>
<template>
  <div class="menu-bar-main">
    <MainMenu />
    <EasyTools />
  </div>
</template>
<style lang="scss" scoped>
.menu-bar-main {
  width: 100vw;
  height: 100px;
  z-index: 2;
  background: var(--ev-back-color);
  display: flex;
  flex-direction: column;
}
</style>
