import {
  ImageryLayer,
  Ion,
  SceneMode,
  SingleTileImageryProvider,
  Viewer,
} from 'cesium';

const globeImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAADCAYAAACwAX77AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABWSURBVBhXAUsAtP8BY3Z+/z0sAwCsygIAFAjlACUQ/QDV7QsAAQdAZP8iGv8ACQL/AFkrFQCg1fUA//4DAAE/XXH/HRcWAOPr7QATEhMADwwMAP389wC1nxmQIMsw2wAAAABJRU5ErkJggg==`;

const DefaultSingleImg = ImageryLayer.fromProviderAsync(
  SingleTileImageryProvider.fromUrl(globeImg),
  {}
);

export function initMap(eleId: string): Viewer {
  Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjUwNWQyOC0yZmZhLTRmMzItOTQyZC02ZmQyMWIyMTA3NmEiLCJpZCI6NjcyNzcsImlhdCI6MTY2ODE1ODc2Mn0.t1h6-ZADkGnZUZZoLtrlgtTp8_MR2Kxfhew42ksDgmk';
  const viewer = new Viewer(eleId, {
    // 基础配置
    animation: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    timeline: false,
    sceneMode: SceneMode.SCENE3D,
    // scene3DOnly: true,
    baseLayerPicker: false,
    navigationHelpButton: false,
    vrButton: false,
    selectionIndicator: false,
    orderIndependentTranslucency: true,
    shouldAnimate: true,
    baseLayer: DefaultSingleImg,

    // WebGL上下文配置
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: true,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      },
      requestWebgl1: false,
    },
  });
  console.log('viewer', viewer);
  // 隐藏logo信息
  (viewer.cesiumWidget.creditContainer as HTMLDivElement).style.display =
    'none';
  return viewer;
}
