<script setup lang="ts">
defineOptions({ name: '侧边栏', inheritAttrs: false });
</script>

<template>
  <div class="side-bar-main border-r"></div>
</template>

<style lang="scss" scoped>
.side-bar-main {
  width: 16%;
  min-width: 220px;
  height: 100%;
  background: var(--ev-back-color);
  display: flex;
}
</style>
