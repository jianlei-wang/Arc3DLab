const nodeEx = {
  id: '0204',
  name: '太空平台',
  image: '',
  loaded: true,
};
const linkEx = {
  id: '0204001->02040014',
  from: '0204001',
  to: '02040014',
  type: '洲际弹道导弹',
};
export function initGraphDatas(datas: []) {
  console.log('原始数据：', datas);
  const img = new URL('./img.png', import.meta.url).href;
  /************************ 图节点数据 ***********************************/

  // 获取现在所有的目标节点
  const nodes_0 = [];
  for (let i = 0; i < datas.length; i++) {
    const { uid, title } = datas[i];
    nodes_0.push({ id: uid, name: title, image: img, loaded: true });
  }
  console.log('所有的目标节点数据：', nodes_0);

  // 获取所有的行政区划节点
  const nodes_1 = [];
  for (let i = 0; i < datas.length; i++) {
    const { regionName } = datas[i];
    if (regionName) {
      const item = nodes_1.find((node) => node.name === regionName);
      if (!item) {
        const id = randomId();
        nodes_1.push({ id, name: regionName, image: img, loaded: true });
      }
    }
  }
  console.log('所有的行政区划节点数据：', nodes_1);

  // 所有目标类型节点
  const nodes_2 = [];
  for (let index = 0; index < datas.length; index++) {
    const { icon } = datas[index];
    const item = nodes_2.find((node) => node.name === icon);
    if (!item) {
      const id = randomId();
      nodes_2.push({ id, name: icon, image: img, loaded: true });
    }
  }
  console.log('所有的目标类型节点数据：', nodes_2);

  const nodes = [...nodes_0, ...nodes_1, ...nodes_2];

  /************************ 图链接数据 ***********************************/

  // 行政区划-目标 链接
  const regionDatas = datas.filter((data) => data.regionName);
  const links_1 = [];
  for (let i = 0; i < regionDatas.length; i++) {
    const { uid, regionName, icon } = regionDatas[i];
    const regionNode = nodes_1.find((node) => node.name === regionName);
    if (regionNode) {
      links_1.push({
        id: `${uid}->${regionNode.id}`,
        from: uid,
        to: regionNode.id,
        type: '所属地区',
      });
      links_1.push({
        id: `${regionNode.id}->${uid}`,
        from: regionNode.id,
        to: uid,
        type: `包含${icon}`,
      });
    }
  }
  console.log('行政区划-目标 链接数据：', links_1);

  // 目标类型-目标 链接
  const links_2 = [];
  for (let i = 0; i < datas.length; i++) {
    const { uid, icon } = datas[i];
    const iconNode = nodes_2.find((node) => node.name === icon);
    if (iconNode) {
      links_2.push({
        id: `${uid}->${iconNode.id}`,
        from: uid,
        to: iconNode.id,
        type: '目标类型',
      });
      links_2.push({
        id: `${iconNode.id}->${uid}`,
        from: iconNode.id,
        to: uid,
        type: '包含目标',
      });
    }
  }
  console.log('目标类型-目标 链接数据：', links_2);
  const links = [...links_1, ...links_2];

  const results = { nodes, links };
  console.log('图数据：', results);
  return results;
}

function randomId() {
  const length = 16;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
