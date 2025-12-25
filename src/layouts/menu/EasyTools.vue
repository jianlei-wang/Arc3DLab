<script setup lang="ts">
import { reactive, ref, onBeforeMount, onMounted } from 'vue';
import DataSource from '@/components/easy-tools/tools/DataSource.vue';
defineOptions({ name: '快捷工具', inheritAttrs: false });
const performance = ref(false);
</script>
<template>
  <div class="easy-tools-main">
    <div class="et-module"><DataSource /></div>
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
  column-gap: 1px;
  .et-module {
    border: 1px solid var(--ev-border-color-a);
    border-left: none;
    display: flex;
    align-items: center;
    height: calc(50% - 2px);

    background: linear-gradient(#1b253180, #1b253180),
      url('../../assets/images/menu/drag.png') no-repeat -1px center;
    padding-left: 25px;
    padding-right: 8px;
  }
}
</style>
