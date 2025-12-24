<script setup lang="ts">
import { reactive, ref, onBeforeMount, onMounted } from 'vue';
defineOptions({ name: '快捷工具', inheritAttrs: false });
const performance = ref(false);
const labels = ref(['performance', 'navigation']);
const model = ref('');
</script>
<template>
  <div class="easy-tools-main">
    <div class="et-module">
      <el-checkbox label="快捷工具" size="small" v-model="performance" />
      <el-radio-group v-model="model" size="small">
        <el-radio v-for="item in labels" :value="item">{{ item }}</el-radio>
      </el-radio-group>
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
:deep(.el-radio-group) {
  flex-direction: column;
  align-items: flex-start;
  .el-radio {
    margin: 0;
    .el-radio__label {
      font-size: 14px;
      color: var(--ev-color-white);
    }
  }
}
</style>
