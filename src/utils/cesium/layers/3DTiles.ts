import { Cesium3DTileset, type Viewer } from 'cesium';

/**
 * 加载3DTIles图层至指定位置
 * @param {Viewer} viewer
 * @param {string} url
 */
export async function load3Dtiles(viewer: Viewer, url: string) {
  // 配置3D Tiles参数以增加内存限制
  const tileset = await Cesium3DTileset.fromUrl(url, {
    // 增加缓存字节数限制 (默认通常是512MB)
    cacheBytes: 10737418240, // 1GB in bytes
    // 设置最大缓存溢出字节数
    maximumCacheOverflowBytes: 536870912, // 512MB in bytes
    // 可选：设置最大屏幕空间误差
    maximumScreenSpaceError: 2,
    // 可选：设置动态屏幕空间误差
    dynamicScreenSpaceError: true,
    // 可选：设置动态屏幕空间误差密度
    dynamicScreenSpaceErrorDensity: 0.00278,
    // 可选：设置动态屏幕空间误差乘数
    dynamicScreenSpaceErrorFactor: 2.0,
    // 可选：设置渐进细节级别
    progressiveResolutionHeightFraction: 0.3,
    // 可选：设置跳过级别
    skipLevelOfDetail: true,
    // 可选：设置跳过级别细节参数
    skipLevels: 1,
    baseScreenSpaceError: 1024,
    skipScreenSpaceErrorFactor: 16,
  });

  tileset.tileLoad.addEventListener((tile) => {
    tile.tileset.trimLoadedTiles();
  });

  viewer.scene.primitives.add(tileset);
  // SetCusMark(tileset, 'primitive', '3dtiles', true);
  return tileset;
}
