import type { EdgeData, NodeData, GraphData } from '@antv/g6';
import graphSourceDatas from '../datas/graph-datas-source.json';

interface TreeNode {
  [key: string]: any;
  child?: TreeNode[];
}

export function handleSourceDatas() {
  console.log(graphSourceDatas);
  const sourceDatas = graphSourceDatas as TreeNode[];
  const results: TreeNode[] = [];

  function recursiveProcess(items: TreeNode[]) {
    if (!items || !Array.isArray(items) || items.length === 0) return;
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      if (
        !item.child ||
        !Array.isArray(item.child) ||
        item.child.length === 0
      ) {
        results.push(item);
      } else {
        recursiveProcess(item.child);
      }
    }
  }

  // 开始递归处理
  recursiveProcess(sourceDatas);
  console.log('目标对象集合：', results);
  const graphDatas = initNodesEdges(results);
  console.log('图数据：', graphDatas);
  return graphDatas;
}

let graphNodes: NodeData[] = [];
let graphEdges: EdgeData[] = [];
let graphDatas: GraphData = {};

const DefNodeStyle = {
  labelFill: '#fff',
  labelFontSize: 12,
};

const DefEdgeStyle = {
  labelFill: '#fff',
  labelFontSize: 10,
  endArrow: true,
};
function initNodesEdges(datas: any[]) {
  /************************ 图节点数据 ***********************************/

  const nodes_0: NodeData[] = []; // 获取现在所有的·目标·节点
  const nodes_1: NodeData[] = []; // 获取现在所有的·目标类型·节点

  for (let i = 0; i < datas.length; i++) {
    const { uid, title, icon } = datas[i];
    const img = new URL(`../icons/${icon}默认.png`, import.meta.url).href;

    nodes_0.push({
      id: uid,
      type: 'image',
      data: { name: title },
      style: { src: img, labelText: title, ...DefNodeStyle },
      // image: img,
      // attribute: datas[i],
    });

    const item = nodes_1.find((node) => node.data?.name === icon);
    if (!item) {
      const id = randomId();
      nodes_1.push({
        id,
        type: 'image',
        data: { name: icon },
        style: { src: img, labelText: icon, ...DefNodeStyle },
      });
    }
  }
  graphNodes = [...nodes_0, ...nodes_1];

  /************************ 图链接数据 ***********************************/

  // 目标类型-目标 链接
  const edges_0: EdgeData[] = [];
  for (let i = 0; i < datas.length; i++) {
    const { uid, icon } = datas[i];
    const iconNode = nodes_1.find((node) => node.data?.name === icon);
    if (iconNode) {
      edges_0.push({
        id: `${iconNode.id}->${uid}`,
        source: iconNode.id!,
        target: uid,
        type: 'line',
        style: {
          labelText: '包含目标',
          ...DefEdgeStyle,
          labelBackground: true,
          labelBackgroundFill: '#000000',
        },
      });
    }
  }

  graphEdges = [...edges_0];

  graphDatas = { nodes: graphNodes, edges: graphEdges };
  return graphDatas;
}

export function query(str: string) {
  const resultNodes: any[] = [];
  const resultLinks: any[] = [];
  let _nodes = graphNodes.filter((ele) =>
    (ele.data?.name as string).includes(str)
  );
  if (_nodes.length === 0) {
    return { nodes: [], links: [] };
  }

  resultNodes.push(..._nodes);
  let nodeIds = _nodes.map((ele) => ele.id);

  let _links = graphEdges.filter((ele) => nodeIds.includes(ele.source));
  resultLinks.push(..._links);
  // debugger;
  for (let index = 0; index < 2; index++) {
    const ids = _links.map((ele) => ele.target);
    const curNodes = graphNodes.filter((ele) => ids.includes(ele.id));
    const curNodeIds: any[] = [];
    for (let n = 0; n < curNodes.length; n++) {
      const { id } = curNodes[n]!;
      const preNode = resultNodes.find((ele) => ele.id === id);
      if (!preNode) {
        resultNodes.push(curNodes[n]);
        curNodeIds.push(id);
      }
    }
    const curLinks = graphEdges.filter((ele) =>
      curNodeIds.includes(ele.source)
    );
    const curLinkIds: any[] = [];
    for (let m = 0; m < curLinks.length; m++) {
      const { id } = curLinks[m]!;
      const preLink = resultLinks.find((ele) => ele.id === id);
      if (!preLink) {
        resultLinks.push(curLinks[m]);
        curLinkIds.push(curLinks[m]);
      }
    }
    _links = curLinkIds;
  }
  const ids = [];
  for (let i = 0; i < resultLinks.length; i++) {
    const { source, target } = resultLinks[i];
    ids.push(source, target);
  }
  const allIds = Array.from(new Set(ids));
  const allNodes = graphNodes.filter((ele) => allIds.includes(ele.id));
  const _graphData = { nodes: allNodes, edges: resultLinks };
  // initializeChart('chartContainer', focusIds);
  // const datasArr: any[] = [];
  // for (let i = 0; i < allNodes.length; i++) {
  //   const { attribute } = allNodes[i];
  //   attribute && datasArr.push(attribute);
  // }
  // const result = { nodes: datasArr, links: resultLinks, clickNode };
  console.log('图数据：', _graphData);

  // // 触发事件，传递结果
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(
      new CustomEvent('graphQueryResult', { detail: _graphData })
    );
  }
  return _graphData;
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

// export function initGraphDatas(datas: any[]) {
//   /************************ 图节点数据 ***********************************/

//   // 获取现在所有的目标节点
//   const nodes_0 = [];
//   for (let i = 0; i < datas.length; i++) {
//     const { uid, title, icon } = datas[i];
//     const img = new URL(`./icons/${icon}默认.png`, import.meta.url).href;
//     nodes_0.push({
//       id: uid,
//       name: title,
//       image: img,
//       loaded: true,
//       attribute: datas[i],
//     });
//   }

//   // 获取所有的行政区划节点
//   const nodes_1: any[] = [];
//   const imgRegion = new URL(`./icons/行政区划.png`, import.meta.url).href;

//   for (let i = 0; i < datas.length; i++) {
//     const { regionName } = datas[i];
//     if (regionName) {
//       const item = nodes_1.find((node) => node.name === regionName);
//       if (!item) {
//         const id = randomId();
//         nodes_1.push({ id, name: regionName, image: imgRegion, loaded: true });
//       }
//     }
//   }

//   // 所有目标类型节点
//   const nodes_2: any[] = [];
//   for (let index = 0; index < datas.length; index++) {
//     const { icon } = datas[index];
//     const img = new URL(`./icons/${icon}默认.png`, import.meta.url).href;

//     const item = nodes_2.find((node) => node.name === icon);
//     if (!item) {
//       const id = randomId();
//       nodes_2.push({ id, name: icon, image: img, loaded: true });
//     }
//   }

//   const nodes = [...nodes_0, ...nodes_1, ...nodes_2];

//   /************************ 图链接数据 ***********************************/

//   // 行政区划-目标 链接
//   const regionDatas = datas.filter((data) => data.regionName);
//   const links_1: any[] = [];
//   for (let i = 0; i < regionDatas.length; i++) {
//     const { uid, regionName, icon } = regionDatas[i];
//     const regionNode = nodes_1.find((node) => node.name === regionName);
//     if (regionNode) {
//       links_1.push({
//         id: `${uid}->${regionNode.id}`,
//         from: uid,
//         to: regionNode.id,
//         type: '所属地区',
//       });
//       links_1.push({
//         id: `${regionNode.id}->${uid}`,
//         from: regionNode.id,
//         to: uid,
//         type: `包含${icon}`,
//       });
//     }
//   }

//   // 目标类型-目标 链接
//   const links_2: any[] = [];
//   for (let i = 0; i < datas.length; i++) {
//     const { uid, icon } = datas[i];
//     const iconNode = nodes_2.find((node) => node.name === icon);
//     if (iconNode) {
//       links_2.push({
//         id: `${uid}->${iconNode.id}`,
//         from: uid,
//         to: iconNode.id,
//         type: '目标类型',
//       });
//       links_2.push({
//         id: `${iconNode.id}->${uid}`,
//         from: iconNode.id,
//         to: uid,
//         type: '包含目标',
//       });
//     }
//   }
//   const links = [...links_1, ...links_2];

//   const results = { nodes, links };
//   return results;
// }

// let menuShow: boolean = false;
// let scaleMenu: number = 0;
// let startDeg: any = 0;
// /**
//  * 隐藏菜单方法
//  * @param scaleMenu 菜单的缩放数值
//  */
// function menuHide(scaleMenu: number): void {
//   const menu: any = document.querySelector('.zChart-menu');
//   if (menuShow) {
//     menu.animate(
//       [
//         { transform: 'rotateZ(360deg) scale(' + scaleMenu + ')' },
//         { transform: 'rotateZ(180deg) scale(0)', display: 'none' },
//       ],
//       {
//         duration: 500, //动画时间
//         easing: 'ease-in', //动画缓动
//         animationFillMode: 'forwards', //动画结束保持
//       }
//     );
//   }
//   menu.style.dispaly = 'none';
//   menu.style.transform = 'rotateZ(0deg) scale(0)';
//   menuShow = false;
// }
// function leftClick(e: any): void {
//   menuHide(scaleMenu);
//   startDeg = 0;
//   if (e.clickNode) {
//     query(e.clickNode.label, e.clickNode);
//   }
// }

// let radiusNetChart: any = 42;
// let menuSize: number = 180;
// function rightClick(e: any): void {
//   e.preventDefault();
//   const menu: any = document.querySelector('.zChart-menu');
//   if (e.clickNode && !menuShow) {
//     menuShow = true;
//     radiusNetChart = e.clickNode.data.size
//       ? e.clickNode.data.size
//       : radiusNetChart;
//     /**
//      * 右键点击为图谱
//      * 获取点击图谱节点的信息
//      * 菜单设置样式，定位、缩放、动画
//      */
//     var dimensions = netChart.getNodeDimensions(e.clickNode);
//     scaleMenu = dimensions.radius / radiusNetChart;
//     menu.style.display = 'block';
//     menu.style.top = dimensions.y - menuSize / 2 + 'px';
//     menu.style.left = dimensions.x - menuSize / 2 + 'px';
//     menu.style.transform = 'scale(' + scaleMenu + ')';
//     menu.animate(
//       [
//         { transform: 'rotateZ(180deg) scale(0.2)' },
//         { transform: 'rotateZ(360deg) scale(' + scaleMenu + ')' },
//         { transform: 'rotateZ(300deg) scale(' + scaleMenu + ')' },
//         { transform: 'rotateZ(360deg) scale(' + scaleMenu + ')' },
//       ],
//       {
//         duration: 500, //动画时间
//         easing: 'ease-in', //动画缓动
//         animationFillMode: 'forwards', //动画结束保持
//       }
//     );
//     const proList: any = [
//       'earth',
//       'date',
//       'Introduction',
//       'more',
//       'navigation',
//       'people',
//       'picture',
//       'trajectory',
//     ];

//     /**
//      * 菜单图标鼠标移入移出事件
//      */
//     // 获取菜单所有图标节点
//     const iconList: any = document.getElementsByClassName('zChart-menu-icon');
//     // 获取菜单选中节点
//     const menuSele: any = document.querySelector('.zChart-menu-sele');
//     // 获取当前图谱节点菜单属性
//     let pro: any = {
//       earth: '',
//       date: '',
//       Introduction: '',
//       more: '',
//       navigation: '',
//       people: '',
//       picture: '',
//       trajectory: '',
//     };
//     // 遍历菜单所有图标节点
//     for (let i = 0; i < iconList.length; i++) {
//       const element = iconList[i];
//       // 鼠标移入事件

//       element.onmouseover = (e: any) => {
//         // 获取鼠标移入菜单图标节点的标识
//         const numIconDom = e.target.className.replace(/[^\d]/g, '') / 1;
//         // 转动结束的角度
//         let endDeg = (numIconDom - 1) * 45;
//         // 判断转动临界值
//         if (Math.abs(endDeg - startDeg / 1) > 180) {
//           endDeg = endDeg > 180 ? endDeg - 360 : endDeg;
//           startDeg = startDeg > 180 ? startDeg - 360 : startDeg;
//         }
//         // 显示菜单选中节点
//         menuSele.style.display = 'block';
//         // 当菜单显示，并且不是第一次转动时，启用动画
//         startDeg !== 0 &&
//           menuSele.animate(
//             [
//               {
//                 transform: 'rotateZ(' + startDeg / 1 + 'deg)',
//                 filter: 'grayscale(100%)',
//               },
//               animateFun,
//             ],
//             { duration: 100, easing: 'ease-in' }
//           );
//         function animateFun(): any {
//           if (!Object.prototype.hasOwnProperty.call(pro, proList[i])) {
//             return {
//               transform: 'rotateZ(' + endDeg + 'deg)',
//               filter: 'grayscale(100%)',
//             };
//           } else {
//             return {
//               transform: 'rotateZ(' + endDeg + 'deg)',
//               filter: 'grayscale(0)',
//             };
//           }
//         }
//         // 判断图谱节点上是否存在菜单属性
//         if (!Object.prototype.hasOwnProperty.call(pro, proList[i])) {
//           menuSele.style.filter = 'grayscale(100%)';
//           element.style.cursor = 'not-allowed';
//         } else {
//           menuSele.style.filter = 'grayscale(0)';
//           element.style.cursor = 'pointer';
//         }
//         menuSele.style.transform = 'rotateZ(' + endDeg + 'deg)';
//         startDeg = endDeg + '';
//       };
//       // 鼠标移出事件
//       element.onmouseout = () => {
//         menuSele.style.display = 'none';
//       };
//       // 菜单点击事件
//       element.onclick = (event: any) => {
//         if (Object.prototype.hasOwnProperty.call(pro, proList[i])) {
//           const type = event.target.dataset.type;
//           onClickMenu(type, e.clickNode.data);
//           menuHide(scaleMenu);
//         }
//       };
//     }
//   } else {
//     menuHide(scaleMenu);
//     startDeg = 0;
//   }
// }
// function onClickMenu(type: string, node: any): void {
//   alert(`点击对象${JSON.stringify(node)},展示信息类型${type}`);
// }
// function moveMenu(): void {
//   var selectedNodes = netChart.selection();
//   var dimensions = netChart.getNodeDimensions(selectedNodes[0]);
//   var scale = dimensions.radius / radiusNetChart;
//   const menu: any = document.querySelector('.zChart-menu');
//   if (menu) {
//     menu.style.transform = 'scale(' + scale + ')';
//     menu.style.left = dimensions.x - menuSize / 2 + 'px';
//     menu.style.top = dimensions.y - menuSize / 2 + 'px';
//   }
// }

// function getImg(name: string): string {
//   return new URL(`./images/${name}.png`, import.meta.url).href;
// }
// function menuRender(): void {
//   const menuCon: any = document.querySelector('.DVSL-menu-container');

//   const dom: any = `<div class="zChart-menu" style="width:${menuSize}px; height:${menuSize}px; display:none; ">
//                 <div class="zChart-menu-sele"></div>
//                 <img class="zChart-menu-icon zChart-menu-icon-8" data-type="trajectory" src=${getImg(
//     'Traj'
//   )} style="position:absolute; left:58px; top:26px; alt="" />
//                 <img class="zChart-menu-icon zChart-menu-icon-1" data-type="earth" src=${getImg(
//     'Earth'
//   )} style="position:absolute; left:98px; top:26px; alt="" />
//                 <img class="zChart-menu-icon zChart-menu-icon-7" data-type="picture" src=${getImg(
//     'Pict'
//   )} style="position:absolute; left:28px; top:58px; alt="" />
//                 <img class="zChart-menu-icon zChart-menu-icon-2" data-type="date" src=${getImg(
//     'Date'
//   )} style="position:absolute; left:132px; top:58px; alt="" />
//                 <img class="zChart-menu-icon zChart-menu-icon-6" data-type="people" src=${getImg(
//     'People'
//   )} style="position:absolute; left:28px; top:98px; alt="" />
//                 <img class="zChart-menu-icon zChart-menu-icon-3" data-type="Introduction" src=${getImg(
//     'Intr'
//   )} style="position:absolute; left:132px; top:98px; alt="" />
//                 <img class="zChart-menu-icon zChart-menu-icon-5" data-type="navigation" src=${getImg(
//     'Nav'
//   )} style="position:absolute; left:58px; top:128px; alt="" />
//                 <img class="zChart-menu-icon zChart-menu-icon-4" data-type="more" src=${getImg(
//     'More'
//   )} style="position:absolute; left:98px; top:128px; alt="" />
//             </div>`;
//   menuCon.insertAdjacentHTML('afterbegin', dom);
// }

// let focusNum: number = 1;
// let maxLevel: number = 2;
// let netChart: any;

// export function destroyChart() {
//   netChart && netChart.destroy && netChart.destroy();
// }
// export function initializeChart(eleId: string, ids?: string[]) {
//   if (ids) {
//     maxLevel = ids.length;
//   }
//   const chartContainer = document.getElementById(eleId);
//   if (!chartContainer || !window.ZoomCharts) return;
//   destroyChart();
//   // 创建图表配置
//   const chartConfig = {
//     container: chartContainer,
//     data: [{ preloaded: graphDatas }],
//     area: { height: chartContainer.clientHeight },
//     events: {
//       onClick: leftClick,
//       onRightClick: rightClick,
//       onPositionChange: moveMenu,
//     },
//     style: {
//       node: {
//         display: 'image',
//         lineWidth: 2,
//         lineColor: '#2fc32f',
//         imageCropping: true,
//         radius: 42,
//       },
//       nodeStyleFunction: function (node: any) {
//         node.display = node.data.image ? 'image' : '';
//         node.lineColor = node.data.lineColor;
//         node.aura = node.data.auras;
//         node.image = node.data.image;
//         node.label = node.data.name;
//       },
//       linkStyleFunction: function (link: any) {
//         if (graphDatas.nodes.length < 50) {
//           link.fillColor = '#fff';
//           link.label = link.data.type;
//         }
//       },
//     },
//     interaction: {
//       resizing: {
//         enabled: false,
//       },
//     },
//     navigation: {
//       mode: 'focusnodes', // "manual", "showall" or "focusnodes"
//       initialNodes: ids || [graphDatas.nodes[0].id], // list of nodes
//       focusNodeExpansionRadius: focusNum,
//       focusNodeTailExpansionRadius: 0.3,
//       numberOfFocusNodes: maxLevel,
//       expandOnClick: false,
//     },
//   };

//   // 创建图表实例
//   netChart = new window.ZoomCharts.NetChart(chartConfig);
//   menuRender();
// }

// export function query(str: string, clickNode?: any) {
//   const resultNodes: any[] = [];
//   const resultLinks: any[] = [];
//   let _nodes = graphNodes.filter((ele) => ele.name.includes(str));
//   if (_nodes.length === 0) {
//     return { nodes: [], links: [] };
//   }
//   let focusIds = _nodes.map((ele) => ele.id);
//   const trueItem = _nodes.find((ele) => ele.name === str);
//   if (trueItem) {
//     focusIds = [trueItem.id];
//   }
//   resultNodes.push(..._nodes);
//   let nodeIds = _nodes.map((ele) => ele.id);

//   let _links = graphEdges.filter((ele) => nodeIds.includes(ele.from));
//   resultLinks.push(..._links);
//   // debugger;
//   for (let index = 0; index < maxLevel; index++) {
//     const ids = _links.map((ele) => ele.to);
//     const curNodes = graphNodes.filter((ele) => ids.includes(ele.id));
//     const curNodeIds: any[] = [];
//     for (let n = 0; n < curNodes.length; n++) {
//       const { id } = curNodes[n];
//       const preNode = resultNodes.find((ele) => ele.id === id);
//       if (!preNode) {
//         resultNodes.push(curNodes[n]);
//         curNodeIds.push(id);
//       }
//     }
//     const curLinks = graphEdges.filter((ele) => curNodeIds.includes(ele.from));
//     const curLinkIds: any[] = [];
//     for (let m = 0; m < curLinks.length; m++) {
//       const { id } = curLinks[m];
//       const preLink = resultLinks.find((ele) => ele.id === id);
//       if (!preLink) {
//         resultLinks.push(curLinks[m]);
//         curLinkIds.push(curLinks[m]);
//       }
//     }
//     _links = curLinkIds;
//   }
//   const ids = [];
//   for (let i = 0; i < resultLinks.length; i++) {
//     const { from, to } = resultLinks[i];
//     ids.push(from, to);
//   }
//   const allIds = Array.from(new Set(ids));
//   const allNodes = graphNodes.filter((ele) => allIds.includes(ele.id));
//   const _graphData = { nodes: allNodes, links: resultLinks };
//   graphDatas = _graphData;
//   initializeChart('chartContainer', focusIds);
//   const datasArr: any[] = [];
//   for (let i = 0; i < allNodes.length; i++) {
//     const { attribute } = allNodes[i];
//     attribute && datasArr.push(attribute);
//   }
//   const result = { nodes: datasArr, links: resultLinks, clickNode };
//   // 触发事件，传递结果
//   if (typeof window !== 'undefined' && window.dispatchEvent) {
//     window.dispatchEvent(
//       new CustomEvent('graphQueryResult', { detail: result })
//     );
//   }
//   return result;
// }
