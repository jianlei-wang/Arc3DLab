<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { load3Dtiles } from '@/utils/cesium/layers/3DTiles';
import { create3DTilesServer } from '@/utils/cesium/VirtualServer';
defineOptions({ name: '添加模型', inheritAttrs: false });
// 3DTTiles模块
const formRef = ref<FormInstance>();
const form = reactive({
  resource: 'local',
  onlineUrl: '',
  localUrl: '',
});

const rules3DTiles = reactive<FormRules<any>>({
  onlineUrl: [
    { required: true, message: '模型在线地址不能为空!', trigger: 'blur' },
  ],
  localUrl: [
    { required: true, message: '模型本地地址不能为空!', trigger: 'blur' },
  ],
});
function openFolder() {
  document.getElementById('folderInput')?.click();
}

async function selectFolder(e: any) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  // if (vServer) vServer.disable();
  console.log(e, files);
  const url = create3DTilesServer(files);
  const model = await load3Dtiles(window.viewer, url!);
  window.viewer.flyTo(model);
}

const add3Dtiles = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
    } else {
      console.error('error submit!', fields);
    }
  });
};
const onCancel = () => {
  console.log('cancel!');
};
</script>
<template>
  <div class="add-model-main">
    <el-tabs type="border-card">
      <el-tab-pane label="3DTiles">
        <el-form
          ref="formRef"
          :model="form"
          label-width="auto"
          class="module-form"
          size="small"
          :rules="rules3DTiles"
        >
          <el-form-item label="数据源">
            <el-radio-group v-model="form.resource">
              <el-radio value="local">本地文件</el-radio>
              <el-radio value="online">在线URL</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="form.resource === 'local'"
            label="本地地址"
            prop="localUrl"
          >
            <el-input v-model="form.localUrl" placeholder="模型本地文件路径" />
            <img
              src="@/assets/images/main/open-dir.png"
              alt="打开目录"
              style="cursor: pointer"
              @click="openFolder"
            />
            <input
              id="folderInput"
              type="file"
              webkitdirectory
              multiple
              style="display: none"
              @change="selectFolder"
            />
          </el-form-item>
          <el-form-item v-else label="在线地址" prop="onlineUrl">
            <el-input
              v-model="form.onlineUrl"
              placeholder="模型对应json在线地址"
            />
          </el-form-item>
          <el-form-item class="tool-btn">
            <el-button type="primary" @click="add3Dtiles(formRef)"
              >确认</el-button
            >
            <el-button type="danger" @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Config">Config</el-tab-pane>
      <el-tab-pane label="Role">Role</el-tab-pane>
      <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.add-model-main {
  width: 100%;
  height: 100%;
  :deep(.el-tabs) {
    border: none !important;
    width: 100%;
    height: 100%;
    .el-tab-pane {
      width: 100%;
      height: 100%;
    }
  }
  .module-form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    :deep(.el-form-item) {
      display: flex;
      align-items: center;
      .el-form-item__content {
        display: inline-flex;
        column-gap: 5px;
        .el-input {
          flex: 1;
        }
      }
    }
    .tool-btn {
      flex: 1;
      align-items: flex-end;
      :deep(.el-form-item__content) {
        justify-content: flex-end !important;
        column-gap: 0;
      }
    }
  }
}
</style>
