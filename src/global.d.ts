/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Viewer } from 'cesium';

//全局变量名
declare global {
  interface Window {
    ZoomCharts: any;
    viewer: Viewer;
    addDockedPanel: (panel: any) => void;
    removeDockedPanel: (panelId: string) => void;
    setPanelContent: (panelId: string, content: any) => void;
    showDockingPreview: () => void;
    hideDockingPreview: () => void;
    setActiveDockedPanel?: (panelTitle: string) => void;
  }
}

export default {};
