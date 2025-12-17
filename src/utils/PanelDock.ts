const dockedPanels: string[] = [];
export function onPanelClose(panelName: string) {
  // 从已停靠面板列表中移除
  const index = dockedPanels.indexOf(panelName);
  if (index > -1) {
    dockedPanels.splice(index, 1);
  }
}

export function onPanelDock(panelName: string, panelData: any) {
  console.log(`${panelName}已停靠:`, panelData);

  // 将面板添加到已停靠列表
  if (!dockedPanels.includes(panelName)) {
    dockedPanels.push(panelName);
  }

  // 激活新停靠的面板标签
  if (window.setActiveDockedPanel) {
    window.setActiveDockedPanel(panelName);
  }
}
