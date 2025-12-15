<script setup lang="ts">
defineOptions({ name: '图层和地址栏', inheritAttrs: false });
</script>
<template>
  <div class="side-bar-main border-r">左侧</div>
</template>
<style lang="scss" scoped>
.side-bar-main {
  width: 15vw;
  min-width: 350px;
  background: orange;
  z-index: 1;
}
</style>
