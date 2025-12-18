<script setup lang="ts">
import DockablePanel from '@/components/dock-panel/DockablePanel.vue';
import GraphView from '@/components/examples/graph/GraphView.vue';
import GitHub from '@/components/GitHub.vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import TimeNow from '@/components/TimeNow.vue';
import { onPanelClose, onPanelDock } from '@/utils/PanelDock';
import { ref, reactive } from 'vue';

defineOptions({ name: '主菜单标题', inheritAttrs: false });

// 定义菜单结构，支持多级嵌套
const menuItems = reactive([
  {
    id: 'project',
    children: [
      { id: 'new-project', label: '新建工程' },
      { id: 'open-project', label: '打开工程' },
      { id: 'save-project', label: '保存工程' },
      {
        id: 'project-settings',
        label: '工程设置',
        children: [
          { id: 'general-settings', label: '常规设置' },
          { id: 'display-settings', label: '显示设置' },
          { id: 'performance-settings', label: '性能设置' },
        ],
      },
    ],
  },
  {
    id: 'data',
    children: [
      { id: 'import-data', label: '导入数据' },
      { id: 'export-data', label: '导出数据' },
      {
        id: 'data-management',
        label: '数据管理',
        children: [
          { id: 'layer-manager', label: '图层管理' },
          { id: 'attribute-table', label: '属性表' },
          { id: 'spatial-query', label: '空间查询' },
        ],
      },
    ],
  },
  {
    id: 'edit',
    children: [
      { id: 'undo', label: '撤销' },
      { id: 'redo', label: '重做' },
      { id: 'cut', label: '剪切' },
      { id: 'copy', label: '复制' },
      { id: 'paste', label: '粘贴' },
    ],
  },
  {
    id: 'view',
    children: [
      { id: 'zoom-in', label: '放大' },
      { id: 'zoom-out', label: '缩小' },
      { id: 'full-extent', label: '全图' },
      {
        id: 'view-modes',
        label: '视图模式',
        children: [
          { id: '2d-mode', label: '2D模式' },
          { id: '3d-mode', label: '3D模式' },
          { id: 'oblique-mode', label: '倾斜模式' },
        ],
      },
    ],
  },
  {
    id: 'tools',
    children: [
      {
        id: 'analysis-tools',
        label: '分析工具',
        children: [
          { id: 'buffer-analysis', label: '缓冲区分析' },
          { id: 'overlay-analysis', label: '叠加分析' },
          { id: 'network-analysis', label: '网络分析' },
        ],
      },
      {
        id: 'drawing-tools',
        label: '绘图工具',
        children: [
          { id: 'point-tool', label: '点工具' },
          { id: 'line-tool', label: '线工具' },
          { id: 'polygon-tool', label: '面工具' },
          { id: 'text-tool', label: '文本工具' },
        ],
      },
    ],
  },
  {
    id: 'setting',
    children: [
      { id: 'preferences', label: '首选项' },
      { id: 'plugins', label: '插件管理' },
      {
        id: 'interface',
        label: '界面设置',
        children: [
          { id: 'theme-settings', label: '主题设置' },
          { id: 'toolbar-layout', label: '工具栏布局' },
          { id: 'shortcut-keys', label: '快捷键设置' },
        ],
      },
    ],
  },
  { id: 'example' },
  { id: 'help' },
]);

const activeItem = ref('');
const activeSubMenus = reactive<{ [key: string]: string }>({});

// 处理鼠标进入菜单项
function handleMouseEnter(itemId: string) {
  activeItem.value = itemId;
}

// 处理鼠标离开菜单项
function handleMouseLeave() {
  activeItem.value = '';
  // 清空所有子菜单激活状态
  Object.keys(activeSubMenus).forEach((key) => {
    delete activeSubMenus[key];
  });
}

// 处理鼠标进入子菜单项
function handleSubMenuEnter(parentId: string, childId: string) {
  activeSubMenus[parentId] = childId;
}

// 处理鼠标离开子菜单项
function handleSubMenuLeave(parentId: string) {
  delete activeSubMenus[parentId];
}

const showExample = ref(false);

function closeExample() {
  showExample.value = false;
  onPanelClose('示例库');
}

const showHelp = ref(false);

function closeHelp() {
  showHelp.value = false;
  onPanelClose('帮助');
}

function menuClick(item: any) {
  !item.children && console.log('点击了菜单项', item);
  const { id } = item;
  if (id === 'example') {
    showExample.value = true;
  }
  if (id === 'help') {
    showHelp.value = true;
  }
}
</script>

<template>
  <div class="first-menu">
    <div class="menu-items">
      <div
        class="menu-item"
        :class="{ active: activeItem === item.id }"
        v-for="item in menuItems"
        :key="item.id"
        @mouseenter="handleMouseEnter(item.id)"
        @mouseleave="handleMouseLeave"
      >
        <span class="menu-item__text" @click="menuClick(item)">{{
          $t(`menu.${item.id}`)
        }}</span>
        <!-- 一级下拉菜单 -->
        <div
          v-if="activeItem === item.id && item.children"
          class="menu-item__dropdown"
          @mouseenter="handleMouseEnter(item.id)"
          @mouseleave="handleMouseLeave"
        >
          <div
            class="submenu-item"
            v-for="child in item.children"
            :key="child.id"
            @mouseenter="
              child.children ? handleSubMenuEnter(item.id, child.id) : null
            "
            @mouseleave="child.children ? handleSubMenuLeave(item.id) : null"
            @click="menuClick(child)"
          >
            <div class="submenu-item-content">
              <span>{{ child.label || $t(`menu.${child.id}`) }}</span>
              <!-- 二级下拉菜单指示器 -->
              <span v-if="child.children" class="submenu-arrow">▶</span>
            </div>
            <!-- 二级下拉菜单 -->
            <div
              v-if="activeSubMenus[item.id] === child.id && child.children"
              class="submenu-level-2"
              @mouseenter="handleSubMenuEnter(item.id, child.id)"
              @mouseleave="handleSubMenuLeave(item.id)"
            >
              <div
                class="submenu-item"
                v-for="grandchild in child.children"
                :key="grandchild.id"
                @click="menuClick(grandchild)"
              >
                <div class="submenu-item-content">
                  <span>{{
                    grandchild.label || $t(`menu.${grandchild.id}`)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="menu-right">
      <LanguageSwitcher />
      <GitHub />
      <TimeNow />
    </div>
    <DockablePanel
      v-model:visible="showExample"
      title="示例库"
      :width="1000"
      :height="800"
      @close="closeExample"
      @dock="onPanelDock('示例库', $event)"
    >
      <GraphView />

      <template #footer>
        <div class="panel-footer-buttons">
          <button class="btn btn-secondary">取消</button>
          <button class="btn btn-primary">应用</button>
        </div>
      </template>
    </DockablePanel>
    <DockablePanel
      v-model:visible="showHelp"
      title="帮助"
      :width="400"
      :height="500"
      @close="closeHelp"
      @dock="onPanelDock('帮助', $event)"
    >
      <div class="panel-body">我是帮助内容</div>

      <template #footer>
        <div class="panel-footer-buttons">
          <button class="btn btn-secondary">取消帮助</button>
          <button class="btn btn-primary">应用帮助</button>
        </div>
      </template>
    </DockablePanel>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/base.scss';

.first-menu {
  display: flex;
  background: linear-gradient(180deg, #046cef40 0%, #046cef 100%);

  .menu-items {
    display: flex;
    align-items: center;
    font-weight: 500;
    padding: 1px 5px;

    .menu-item {
      position: relative;
      display: inline-flex;
      flex-direction: column;

      &.active,
      &:hover {
        cursor: pointer;

        .menu-item__text {
          color: var(--ev-color-active);
          background: linear-gradient(0deg, #047dd6 0%, #047dd600 100%);
        }
      }

      .menu-item__text {
        padding: 5px 15px;
        transition: all 0.3s ease;
        letter-spacing: 1px;
      }

      .menu-item__dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background: #17375d;
        border-top: 1px solid var(--ev-border-light);
        z-index: 99;
        width: max-content;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

        .submenu-item {
          position: relative;

          .submenu-item-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            font-size: 14px;

            &:hover {
              background-color: #047dd6;
              cursor: pointer;
            }

            .submenu-arrow {
              margin-left: 5px;
              font-size: 12px;
              transform: translateY(-1px);
            }
          }

          .submenu-level-2 {
            position: absolute;
            left: 100%;
            top: 0;
            width: max-content;
            background: #17375d;
            border: 1px solid var(--ev-border-light);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            z-index: 99;
          }
        }
      }
    }
  }

  .menu-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 15px;
    padding-right: 15px;
  }
}
</style>
