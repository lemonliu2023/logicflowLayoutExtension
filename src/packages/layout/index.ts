import LogicFlow from '@logicflow/core';
import { AntVDagreLayout, type AntVDagreLayoutOptions } from '@antv/layout';
import { Graph } from '@antv/graphlib';

export class Layout {
  lf: LogicFlow;
  options: AntVDagreLayoutOptions;
  static pluginName = 'Layout';
  constructor({ lf }) {
    this.lf = lf;
  }

  getBytesLength(word: string): number {
    if (!word) {
      return 0;
    }
    let totalLength = 0;
    for (let i = 0; i < word.length; i++) {
      const c = word.charCodeAt(i);
      if (word.match(/[A-Z]/)) {
        totalLength += 1.5;
      } else if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        totalLength += 1;
      } else {
        totalLength += 2;
      }
    }
    return totalLength;
  }
  async layout(options: AntVDagreLayoutOptions = {}) {
    const { nodes, edges, gridSize } = this.lf.graphModel;
    let nodesep = 40;
    let ranksep = 40;
    if (gridSize > 20) {
      nodesep = gridSize * 2;
      ranksep = gridSize * 2;
    }
    const initOptions = {
      nodeSize: 100,
      begin: [100, 100],
      align: 'DR',
      radial: true,
      rankdir: 'LR',
      nodesep,
      ranksep
    };
    this.options = Object.assign(initOptions, options);
    const layoutInstance = new AntVDagreLayout(this.options);
    const graph = new Graph({
      nodes: nodes.map((node) => ({
        id: node.id,
        data: {
          width: node.width,
          height: node.height,
        },
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        data: {},
      })),
    });
    const layoutData = await layoutInstance.execute(graph);
    const newGraphData = {
      nodes: [],
      edges: [],
    };
    layoutData.nodes.forEach((node) => {
      const data = node.data;
      const originData = this.lf.getNodeModelById(String(node.id)).getData();
      newGraphData.nodes.push({
        ...originData,
        x: data.x,
        y: data.y,
        text: {
          ...originData.text,
          x: data.x,
          y: data.y,
        },
      });
    });
    layoutData.edges.forEach((edge) => {
      const model = this.lf.getEdgeModelById(String(edge.id));
      const data = model.getData();
      data.pointsList = this.calcPointsList(model, layoutData.nodes);
      if (data.pointsList) {
        const first = data.pointsList[0];
        const last = data.pointsList[data.pointsList.length - 1];
        data.startPoint = { x: first.x, y: first.y };
        data.endPoint = { x: last.x, y: last.y };
        if (data.text && data.text.value) {
          data.text = {
            x: last.x - this.getBytesLength(data.text.value) * 6 - 10,
            y: last.y,
            value: data.text.value,
          };
        }
      } else {
        // data.startPoint = undefined;
        // data.endPoint = undefined;
        // if (data.text && data.text.value) {
        //   data.text = data.text.value;
        // }
      }
      newGraphData.edges.push(data);
    });
    this.lf.render({
      nodes: layoutData.nodes.map((node) => {
        const data = node.data;
        const originData = this.lf.getNodeModelById(String(node.id)).getData();
        return {
          ...originData,
          x: data.x,
          y: data.y,
          text: {
            ...originData.text,
            x: data.x,
            y: data.y,
          },
        };
      }),
      edges: layoutData.edges.map((edge) => {
        const model = this.lf.getEdgeModelById(String(edge.id));
        const data = model.getData();
        data.pointsList = this.calcPointsList(model, layoutData.nodes);
        if (data.pointsList) {
          const first = data.pointsList[0];
          const last = data.pointsList[data.pointsList.length - 1];
          data.startPoint = { x: first.x, y: first.y };
          data.endPoint = { x: last.x, y: last.y };
          if (data.text && data.text.value) {
            data.text = {
              x: last.x - this.getBytesLength(data.text.value) * 6 - 10,
              y: last.y,
              value: data.text.value,
            };
          }
        } else {
          // data.startPoint = undefined;
          // data.endPoint = undefined;
          // if (data.text && data.text.value) {
          //   data.text = data.text.value;
          // }
        }
        return data;
      }),
    });
  }

  calcPointsList(model, nodes) {
    const pointsList = [];
    const sourceNodeModel = this.lf.getNodeModelById(model.sourceNodeId);
    const targetNodeModel = this.lf.getNodeModelById(model.targetNodeId);
    const newSourceNodeData = nodes.find((node) => node.id === model.sourceNodeId).data;
    const newTargetNodeData = nodes.find((node) => node.id === model.targetNodeId).data;
    if (this.options.rankdir === 'LR') {
      // 从左到右
      if (newSourceNodeData.y === newTargetNodeData.y) {
        pointsList.push({
          x: newSourceNodeData.x + sourceNodeModel.width / 2,
          y: newSourceNodeData.y,
        });
        pointsList.push({
          x: newSourceNodeData.x,
          y: newTargetNodeData.y,
        });
        pointsList.push({
          x: newTargetNodeData.x - targetNodeModel.width / 2,
          y: newTargetNodeData.y,
        });
        return pointsList;
      }
      if (newSourceNodeData.y < newTargetNodeData.y) {
        pointsList.push({
          x: newSourceNodeData.x,
          y: newSourceNodeData.y + sourceNodeModel.height / 2,
        });
        pointsList.push({
          x: newSourceNodeData.x,
          y: newTargetNodeData.y,
        });
        pointsList.push({
          x: newTargetNodeData.x - targetNodeModel.width / 2,
          y: newTargetNodeData.y,
        });
        return pointsList;
      }
      if (newSourceNodeData.y > newTargetNodeData.y) {
        pointsList.push({
          x: newSourceNodeData.x,
          y: newSourceNodeData.y - sourceNodeModel.height / 2,
        });
        pointsList.push({
          x: newSourceNodeData.x,
          y: newTargetNodeData.y,
        });
        pointsList.push({
          x: newTargetNodeData.x - targetNodeModel.width / 2,
          y: newTargetNodeData.y,
        });
        return pointsList;
      }
    }
    if (this.options.rankdir === 'RL') {
      // 从右到左
      if (newSourceNodeData.y === newTargetNodeData.y) {
        pointsList.push({
          x: newSourceNodeData.x - sourceNodeModel.width / 2,
          y: newSourceNodeData.y,
        });
        pointsList.push({
          x: newSourceNodeData.x,
          y: newTargetNodeData.y,
        });
        pointsList.push({
          x: newTargetNodeData.x + targetNodeModel.width / 2,
          y: newTargetNodeData.y,
        });
        return pointsList;
      }
      if (newSourceNodeData.y < newTargetNodeData.y) {
        pointsList.push({
          x: newSourceNodeData.x,
          y: newSourceNodeData.y + sourceNodeModel.height / 2,
        });
        pointsList.push({
          x: newSourceNodeData.x,
          y: newTargetNodeData.y,
        });
        pointsList.push({
          x: newTargetNodeData.x + targetNodeModel.width / 2,
          y: newTargetNodeData.y,
        });
        return pointsList;
      }
      if (newSourceNodeData.y > newTargetNodeData.y) {
        pointsList.push({
          x: newSourceNodeData.x,
          y: newSourceNodeData.y - sourceNodeModel.height / 2,
        });
        pointsList.push({
          x: newSourceNodeData.x,
          y: newTargetNodeData.y,
        });
        pointsList.push({
          x: newTargetNodeData.x + targetNodeModel.width / 2,
          y: newTargetNodeData.y,
        });
        return pointsList;
      }
    }
    // 从上到下
    // 从左到右
  }

  destroy() {
    // do anything
  }
}
