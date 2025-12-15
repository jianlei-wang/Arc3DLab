/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Viewer } from 'cesium';

//全局变量名
declare global {
  interface Window {
    viewer: Viewer;
  }
}
export default {};
