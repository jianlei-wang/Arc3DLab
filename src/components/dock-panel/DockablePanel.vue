<script setup lang="ts">
import { onPanelDock } from '@/utils/PanelDock';
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
defineOptions({ name: '弹窗组件_支持拖拽贴边', inheritAttrs: false });

// 定义 props
interface Props {
  visible?: boolean;
  title?: string;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  dockable?: boolean; // 是否支持贴边功能
  fullscreenOverlay?: boolean; // 是否全屏遮罩
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '面板标题',
  width: 400,
  height: 300,
  minWidth: 200,
  minHeight: 150,
  dockable: true, // 默认支持贴边功能
  fullscreenOverlay: true, // 默认全屏遮罩
});

// 定义 emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'close'): void;
  (e: 'dock', panelData: any): void; // 当面板停靠时触发
}>();

// 响应式数据
const panelRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const panelPosition = ref({ x: 0, y: 0 });
const isPositionInitialized = ref(false); // 标记位置是否已初始化

// 计算面板样式
const panelStyle = computed(() => {
  const width =
    typeof props.width === 'number' ? `${props.width}px` : props.width;
  const height =
    typeof props.height === 'number' ? `${props.height}px` : props.height;
  const minWidth =
    typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth;
  const minHeight =
    typeof props.minHeight === 'number'
      ? `${props.minHeight}px`
      : props.minHeight;

  // 只有在位置初始化完成后才应用位置样式
  const style: any = {
    width,
    height,
    minWidth,
    minHeight,
  };

  if (isPositionInitialized.value) {
    style.left = `${panelPosition.value.x}px`;
    style.top = `${panelPosition.value.y}px`;
  }

  return style;
});

// 关闭面板
const closePanel = () => {
  emit('update:visible', false);
  emit('close');
};

// 处理遮罩层点击
const handleOverlayClick = (event: MouseEvent) => {
  // 移除此功能：即使是全屏遮罩也不自动关闭弹窗
  // 点击遮罩层不执行任何操作，只通过关闭按钮关闭弹窗
};

// 处理面板鼠标按下
const handlePanelMouseDown = () => {
  // 将面板置于最前面
  if (panelRef.value) {
    panelRef.value.style.zIndex = '9999';
  }
};

// 开始拖拽
const startDrag = (event: MouseEvent) => {
  if (!panelRef.value || !isPositionInitialized.value) return;

  isDragging.value = true;

  // 计算鼠标相对于面板的偏移量
  const rect = panelRef.value.getBoundingClientRect();
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };

  // 将面板置于最前面
  panelRef.value.style.zIndex = '9999';

  // 如果支持贴边功能，隐藏停靠预览
  if (props.dockable && window.hideDockingPreview) {
    window.hideDockingPreview();
  }
};

// 拖拽过程
const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || !panelRef.value || !isPositionInitialized.value)
    return;

  // 计算新的位置
  const newX = event.clientX - dragOffset.value.x;
  const newY = event.clientY - dragOffset.value.y;

  // 获取窗口尺寸
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // 获取面板尺寸
  const panelWidth = panelRef.value.offsetWidth;
  const panelHeight = panelRef.value.offsetHeight;

  // 边界检查
  panelPosition.value = {
    x: Math.max(0, Math.min(newX, windowWidth - panelWidth)),
    y: Math.max(0, Math.min(newY, windowHeight - panelHeight)),
  };

  // 如果支持贴边功能，检查是否靠近右边边缘（30px范围内）实现停靠预览
  if (props.dockable) {
    const rightDistance = windowWidth - (panelPosition.value.x + panelWidth);
    if (rightDistance <= 30) {
      // 显示停靠预览
      window.showDockingPreview && window.showDockingPreview();
    } else {
      // 隐藏停靠预览
      window.hideDockingPreview && window.hideDockingPreview();
    }
  }
};

// 结束拖拽
const stopDrag = () => {
  if (!isDragging.value || !panelRef.value) return;

  isDragging.value = false;

  // 如果支持贴边功能
  if (props.dockable) {
    // 获取窗口尺寸
    const windowWidth = window.innerWidth;
    const panelWidth = panelRef.value.offsetWidth;

    // 检查是否靠近右边边缘（30px范围内）实现停靠
    const rightDistance = windowWidth - (panelPosition.value.x + panelWidth);
    if (rightDistance <= 30) {
      // 隐藏停靠预览
      if (window.hideDockingPreview) {
        window.hideDockingPreview();
      }

      // 停靠面板
      dockPanel();
    } else {
      // 隐藏停靠预览
      if (window.hideDockingPreview) {
        window.hideDockingPreview();
      }
    }
  }
};

// 停靠面板
const dockPanel = () => {
  // 使用 PanelDock.ts 中的 onPanelDock 函数处理停靠逻辑
  if (Boolean(window.addDockedPanel)) {
    // 确保获取到完整的面板内容
    nextTick(() => {
      const content =
        panelRef.value?.querySelector('.panel-content')?.innerHTML;
      onPanelDock(props.title, { content: content, width: props.width });

      // 在获取内容后再关闭浮动面板
      emit('update:visible', false);
    });
  } else {
    // 如果没有全局函数，直接关闭面板
    emit('update:visible', false);
  }
};

// 初始化面板位置（居中显示）
const initPanelPosition = () => {
  if (!panelRef.value) return;

  // 初始位置居中
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const panelWidth = panelRef.value.offsetWidth || props.width;
  const panelHeight = panelRef.value.offsetHeight || props.height;

  // 确保使用数字值
  const widthValue =
    typeof panelWidth === 'number'
      ? panelWidth
      : parseInt(panelWidth.toString(), 10);
  const heightValue =
    typeof panelHeight === 'number'
      ? panelHeight
      : parseInt(panelHeight.toString(), 10);

  panelPosition.value = {
    x: (windowWidth - widthValue) / 2,
    y: (windowHeight - heightValue) / 2,
  };

  // 标记位置已初始化
  isPositionInitialized.value = true;
};

// 监听 visible 属性变化，当面板显示时重新居中
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 重置位置初始化标记
      isPositionInitialized.value = false;

      // 使用 nextTick 确保 DOM 已更新
      nextTick(() => {
        // 延迟一小段时间确保面板尺寸已计算
        setTimeout(() => {
          initPanelPosition();
        }, 50);
      });
    } else {
      // 面板关闭时重置位置初始化标记
      isPositionInitialized.value = false;
    }
  }
);

// 生命周期钩子
onMounted(() => {
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('resize', handleResize);
});

// 监听窗口大小变化
function handleResize() {
  if (!panelRef.value || !isPositionInitialized.value) return;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const panelWidth = panelRef.value.offsetWidth;
  const panelHeight = panelRef.value.offsetHeight;

  // 调整面板位置，确保不会超出边界
  panelPosition.value = {
    x: Math.max(0, Math.min(panelPosition.value.x, windowWidth - panelWidth)),
    y: Math.max(0, Math.min(panelPosition.value.y, windowHeight - panelHeight)),
  };
}
</script>
<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="dockable-panel-overlay"
      :class="{ 'fullscreen-overlay': fullscreenOverlay }"
      @mousedown="handleOverlayClick"
    >
      <div
        ref="panelRef"
        class="dockable-panel"
        :style="panelStyle"
        @mousedown.stop="handlePanelMouseDown"
      >
        <!-- 弹窗头部，支持<template #header>调整 -->
        <div class="panel-header" @mousedown="startDrag">
          <slot name="header">
            <div class="header-content">
              <h3>{{ title }}</h3>
              <button class="close-btn" @click="closePanel">×</button>
            </div>
          </slot>
        </div>

        <!-- 弹窗内容 -->
        <div class="panel-content">
          <slot></slot>
        </div>

        <!-- 弹窗底部 -->
        <div class="panel-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.dockable-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;

  // 非全屏遮罩模式
  &:not(.fullscreen-overlay) {
    background-color: transparent;
    pointer-events: none;

    .dockable-panel {
      pointer-events: all;
    }
  }

  // 全屏遮罩模式
  &.fullscreen-overlay {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.dockable-panel {
  position: fixed;
  background: var(--ev-back-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  transition: all 0.2s ease;

  // 在位置未初始化时隐藏面板，避免闪烁
  opacity: 0;

  // 位置初始化后显示面板
  &:not([style*='left']) {
    opacity: 0;
  }

  &[style*='left'] {
    opacity: 1;
  }
}

.panel-header {
  background: var(--ev-back-primary);
  color: var(--ev-color-head);
  padding: 10px 16px;
  cursor: move;
  user-select: none;
  font-weight: bold;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 16px;
      letter-spacing: 1px;
    }
  }
}

.panel-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

.panel-footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
