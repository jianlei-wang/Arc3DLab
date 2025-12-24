<script setup lang="ts">
import { reactive, ref, onBeforeMount, onMounted } from 'vue';
defineOptions({ name: '快捷工具', inheritAttrs: false });
const performance = ref(false);
</script>
<template>
  <div class="easy-tools-main">
    <div class="et-module">
      <el-checkbox label="快捷工具" size="small" v-model="performance" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.easy-tools-main {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  .et-module {
    border: 1px solid var(--ev-border-color-a);
    display: flex;
    align-items: center;
    height: calc(50% - 2px);
    background: url('../../assets/images/menu/drag.png') no-repeat -3px center;
    padding-left: 20px;
  }
}
</style>
