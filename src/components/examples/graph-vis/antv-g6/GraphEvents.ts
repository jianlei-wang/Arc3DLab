import { NodeEvent, type Graph } from '@antv/g6';
import { query } from './GraphView';

export function initGraphEvents(graph: Graph) {
  nodeEvents(graph);
  edgeEvents(graph);
  actionEvents(graph);
}

function nodeEvents(graph: Graph) {
  graph.on(NodeEvent.POINTER_ENTER, (event: any) => {
    const nodeId = event.target.id;
    graph.updateNodeData([
      {
        id: nodeId,
        style: {
          labelFill: 'lightgreen',
          cursor: 'pointer',
          labelFontWeight: 'bold',
        },
      },
    ]);
    graph.draw();
  });
  graph.on(NodeEvent.POINTER_LEAVE, (event: any) => {
    const nodeId = event.target.id;
    graph.updateNodeData([
      {
        id: nodeId,
        style: {
          labelFill: '#fff',
          labelFontWeight: 'normal',
        },
      },
    ]);
    graph.draw();
  });
}

function edgeEvents(graph: Graph) {}

function actionEvents(graph: Graph) {
  graph.on(NodeEvent.CLICK, (event: any) => {
    console.log(event);
    const name = event.target.attributes.labelText;
    query(name);
  });
}
