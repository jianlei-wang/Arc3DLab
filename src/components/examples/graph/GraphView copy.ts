import http from '@/utils/request';

export interface TreeNode {
  [key: string]: any;
  child?: TreeNode[];
}

/**
 * 递归处理树形数据，提取所有叶子节点
 * @param datas 树形数据数组
 * @returns 所有叶子节点的数组
 */
export function initSourceDatas(datas: TreeNode[]): TreeNode[] {
  const results: TreeNode[] = [];
  const urls: string[] = [];
  /**
   * 递归处理数据项
   * @param items 数据项数组
   */
  async function recursiveProcess(items: TreeNode[]) {
    // 边界检查
    if (!items || !Array.isArray(items) || items.length === 0) return;

    for (const item of items) {
      // 检查参数有效性
      if (!item || typeof item !== 'object') continue;

      // 如果有child属性且child为非空数组，则递归处理
      if (item.child && Array.isArray(item.child) && item.child.length > 0) {
        recursiveProcess(item.child);
      } else {
        // 没有child或child为空数组时，将当前项添加到结果数组
        // 这包括两种情况：
        // 1. 明确没有child属性的对象
        // 2. child属性为空数组的对象
        results.push(item);
      }
    }
  }

  // 开始递归处理
  recursiveProcess(datas);
  console.log('目标对象集合：', results);
  return results;
}
const startNum = 4000;
const endNum = startNum + 500;
// 初始化地区
export async function initRegionDatas(datas: any[]) {
  let regionDatas = datas.filter((ele) => ele.position);
  const noRegionDatas = datas.filter((ele) => !ele.position);
  const urls: string[] = [];
  regionDatas = regionDatas.slice(startNum, endNum);
  console.log('当前处理的数据集合：', regionDatas);
  // regionDatas.length
  for (let index = 0; index < regionDatas.length; index++) {
    const { position } = regionDatas[index];
    const { coordinates } = JSON.parse(position);
    const url = `http://localhost:8086/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aregion&maxFeatures=50&outputFormat=application%2Fjson&CQL_FILTER=INTERSECTS(the_geom,POINT(${coordinates[0]} ${coordinates[1]}))`;
    urls.push(url);
  }
  console.log('待处理URL集合：', urls);
  try {
    // 对于大量请求，使用并发控制
    const regions = await fetchWithConcurrencyControl(urls, 10);
    console.log(`处理了 ${urls.length} 个请求，结果数量:`, regions.length);
    const regionNames = [];
    for (let i = 0; i < regions.length; i++) {
      const { data } = regions[i];
      const feature = data.features[0];
      if (feature) {
        regionNames.push(feature.properties.division);
      } else {
        regionNames.push('未知地区');
      }
    }
    console.log('全部地区处理完成', regionNames);
    return regionDatas;
  } catch (error) {
    console.error('请求处理失败:', error);
  }
}

export async function resetRegion(datas: any[]) {
  let regionDatas = datas.filter((ele) => ele.position);
  const noRegionDatas = datas.filter((ele) => !ele.position);
  const regions = await http.get(
    'http://localhost:8086/ggdk/process1-500.json'
  );
  const { data } = regions;
  const items = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const element = data[key];
      items.push(...element);
    }
  }
  console.log('待处理数据集合：', regions, items);
  for (let index = 0; index < regionDatas.length; index++) {
    regionDatas[index].regionName = items[index];
  }
  const results = regionDatas.concat(noRegionDatas);
  console.log('全部地区处理完成', results);
  return results;
}

/**
 * 并发控制请求函数
 * @param urls 请求URL数组
 * @param maxConcurrent 最大并发数，默认为10
 * @returns Promise数组
 */
async function fetchWithConcurrencyControl(
  urls: string[],
  maxConcurrent: number = 10
): Promise<any[]> {
  const results: any[] = [];

  // 如果URL数量较少，直接使用请求合并
  if (urls.length <= maxConcurrent) {
    const promises = urls.map((url) =>
      http.get(url, { enableMerge: true, mergeWindow: 200 })
    );
    return Promise.all(promises);
  }

  // 分批处理大量请求，避免 net::ERR_INSUFFICIENT_RESOURCES 错误
  console.log(`开始处理 ${urls.length} 个请求，最大并发数: ${maxConcurrent}`);

  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    console.log(
      `处理批次 ${Math.floor(i / maxConcurrent) + 1}/${Math.ceil(
        urls.length / maxConcurrent
      )}, 批次大小: ${batch.length}`
    );

    const promises = batch.map((url) =>
      http.get(url, { enableMerge: true, mergeWindow: 200 })
    );

    try {
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);

      // 添加短暂延迟，避免过于频繁的请求
      if (i + maxConcurrent < urls.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(
        `批次 ${Math.floor(i / maxConcurrent) + 1} 请求失败:`,
        error
      );
      // 继续处理下一个批次
    }
  }

  console.log(`所有请求处理完成，总结果数: ${results.length}`);
  return results;
}

// // 根据经纬度返回行政区划编码
// export async function codeByCoord(lng: number, lat: number) {
//   const url = `http://localhost:8086/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3Aregion&maxFeatures=50&outputFormat=application%2Fjson&CQL_FILTER=INTERSECTS(the_geom,POINT(${lng} ${lat}))`;
//   const res = await http.get(url);
//   console.log(res);
//   return res;
// }


