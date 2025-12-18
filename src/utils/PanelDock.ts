import { ref, shallowRef } from 'vue';

// 存储停靠的面板
const dockedPanels = ref<any[]>([]);
// 存储面板内容
const panelContents = shallowRef<Map<string, any>>(new Map());
// 当前激活的面板
const activePanel = ref<any>(null);
// 显示停靠预览
const showDockPreview = ref(false);

// 外部响应式引用的更新函数
let updateExternalRefs: (() => void) | null = null;

// 设置外部响应式引用更新函数
export function setExternalRefUpdater(updater: () => void) {
  updateExternalRefs = updater;
}

// 在数据变化时调用外部更新函数
function callExternalUpdater() {
  if (updateExternalRefs) {
    updateExternalRefs();
  }
}

// 添加停靠面板的方法
export function addDockedPanel(panel: any) {
  dockedPanels.value.push(panel);
  // 自动激活新添加的面板
  activePanel.value = panel;
  // 更新外部引用
  callExternalUpdater();
}

// 移除停靠面板的方法
export function removeDockedPanel(panelId: string) {
  const index = dockedPanels.value.findIndex((p) => p.id === panelId);
  if (index > -1) {
    dockedPanels.value.splice(index, 1);
    if (activePanel.value && activePanel.value.id === panelId) {
      activePanel.value =
        dockedPanels.value.length > 0 ? dockedPanels.value[0] : null;
    }
  }
  // 更新外部引用
  callExternalUpdater();
}

// 设置面板内容的方法
export function setPanelContent(panelId: string, content: any) {
  panelContents.value.set(panelId, content);
}

// 根据面板标题设置激活面板
export function setActiveDockedPanel(panelTitle: string) {
  const panel = dockedPanels.value.find((p) => p.title === panelTitle);
  if (panel) {
    activePanel.value = panel;
  }
  // 更新外部引用
  callExternalUpdater();
}

// 显示停靠预览
export function showDockingPreview() {
  showDockPreview.value = true;
  // 更新外部引用
  callExternalUpdater();
}

// 隐藏停靠预览
export function hideDockingPreview() {
  showDockPreview.value = false;
  // 更新外部引用
  callExternalUpdater();
}

// 获取停靠面板相关数据
export function getDockedPanels() {
  return dockedPanels.value;
}

export function getActivePanel() {
  return activePanel.value;
}

export function getPanelContents() {
  return panelContents.value;
}

export function getShowDockPreview() {
  return showDockPreview.value;
}

// 计算是否显示统一关闭按钮
export function getShowUnifiedCloseButton() {
  return dockedPanels.value.length === 1;
}

export function onPanelClose(panelName: string) {
  // 从已停靠面板列表中移除
  const index = dockedPanels.value.findIndex((p: any) => p.title === panelName);
  if (index > -1) {
    dockedPanels.value.splice(index, 1);
  }
}

export function onPanelDock(panelName: string, panelData: any) {
  console.log(`${panelName}已停靠:`, panelData);

  // 检查是否已存在同名面板
  let existingPanel = dockedPanels.value.find(
    (p: any) => p.title === panelName
  );

  if (!existingPanel) {
    // 创建新面板
    const newPanel = {
      id: 'panel_' + Date.now(),
      title: panelName,
      ...panelData,
    };
    dockedPanels.value.push(newPanel);
    existingPanel = newPanel;
  }

  // 更新面板数据
  if (panelData) {
    Object.assign(existingPanel, panelData);

    // 保存面板内容
    if (panelData.content) {
      setPanelContent(existingPanel.id, panelData.content);
    }
  }

  // 自动激活面板
  activePanel.value = existingPanel;

  // 更新外部引用
  callExternalUpdater();
}

// 初始化全局函数
export function initializeDockPanelGlobals() {
  // 确保 window 对象有正确的类型
  window.addDockedPanel = addDockedPanel;
  window.removeDockedPanel = removeDockedPanel;
  window.setPanelContent = setPanelContent;
  window.showDockingPreview = showDockingPreview;
  window.hideDockingPreview = hideDockingPreview;
  window.setActiveDockedPanel = setActiveDockedPanel;
}
