<script setup lang="ts">
defineOptions({ name: '状态栏', inheritAttrs: false });
</script>
<template>
  <div class="status-bar-main"></div>
</template>
<style lang="scss" scoped>
.status-bar-main {
  width: 100vw;
  height: 30px;
  background: var(--ev-back-color);
  z-index: 2;
}
</style>
