import { AntVDagreLayout } from '@antv/layout';
import { useEffect } from 'react';
import { Circle, Canvas, CanvasEvent, Polyline, Text } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Graph } from '@antv/graphlib';

const data = {
  nodes: [
    {
      id: '10',
      data: {
        name: 'alps_file1',
        foo: 'bar',
        fffffff: 'ffadsfadsfafasf',
      },
    },
    {
      id: '2',
      data: {
        name: 'alps_file2',
      },
    },
    {
      id: '3',
      data: {
        name: 'alps_file3',
      },
    },
    {
      id: '4',
      data: {
        name: 'sql_file1',
      },
    },
    {
      id: '5',
      data: {
        name: 'sql_file2',
      },
    },
    {
      id: '6',
      data: {
        name: 'feature_etl_1',
      },
    },
    {
      id: '7',
      data: {
        name: 'feature_etl_1',
      },
    },
    {
      id: '8',
      data: {
        name: 'feature_extractor',
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      data: {
        fjjkljljk: 'fff',
      },
      source: '10',
      target: '2',
    },
    {
      id: 'e3',
      data: {},
      source: '2',
      target: '4',
    },
    {
      id: 'e2',
      data: {},
      source: '10',
      target: '3',
    },
    {
      id: 'e4',
      data: {},
      source: '3',
      target: '4',
    },
    {
      id: 'e5',
      data: {},
      source: '4',
      target: '5',
    },
    {
      id: 'e6',
      data: {},
      source: '5',
      target: '6',
    },
    {
      id: '7',
      data: {},
      source: '6',
      target: '7',
    },
    {
      id: 'e8',
      data: {},
      source: '6',
      target: '8',
    },
  ],
};

const graph = new Graph<{ foo: string }, { bar: string }>({
  nodes: [
    {
      id: '10',
      data: {
        foo: 'bar',
      },
    },
    {
      id: '2',
      data: {
        foo: 'alps_file2',
      },
    },
    {
      id: '3',
      data: {
        foo: 'alps_file3',
      },
    },
    {
      id: '4',
      data: {
        foo: 'sql_file1',
      },
    },
    {
      id: '5',
      data: {
        foo: 'sql_file2',
      },
    },
    {
      id: '6',
      data: {
        foo: 'feature_etl_1',
      },
    },
    {
      id: '7',
      data: {
        foo: 'feature_etl_1',
      },
    },
    {
      id: '8',
      data: {
        foo: 'feature_extractor',
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      data: {
        bar: '111'
      },
      source: '10',
      target: '2',
    },
    {
      id: 'e3',
      data: {
        bar: '222'
      },
      source: '2',
      target: '4',
    },
    {
      id: 'e2',
      data: {
        bar: '33'
      },
      source: '10',
      target: '3',
    },
    {
      id: 'e4',
      data: {
        bar: 'dfdf'
      },
      source: '3',
      target: '4',
    },
    {
      id: 'e5',
      data: {
        bar: 'dfdf'
      },
      source: '4',
      target: '5',
    },
    {
      id: 'e6',
      data: {
        bar: 'dfdf'
      },
      source: '5',
      target: '6',
    },
    {
      id: '7',
      data: {
        bar: 'dfdf'
      },
      source: '6',
      target: '7',
    },
    {
      id: 'e8',
      data: {
        bar: 'dfdf'
      },
      source: '6',
      target: '8',
    },
  ],
  onChanged(event) {
    console.log(event, 'event');
  },
});

function Test() {
  useEffect(() => {
    const dagre = new AntVDagreLayout({
      nodeSize: 2,
      controlPoints: true,
      begin: [100, 100],
      align: 'UR',
      radial: true,
    });
    console.log(dagre, 'dagre');
    // 创建画布
    const canvas = new Canvas({
      container: 'container',
      width: 1500,
      height: 1500,
      supportsPointerEvents: true,
      supportsTouchEvents: true,
      renderer: new CanvasRenderer(), // 选择一个渲染器
    });

    // canvas.addEventListener(CanvasEvent.READY, function () {
    dagre
      .execute(graph, {
        rankdir: 'LR',
        // ranker: 'tight-tree'
      })
      .then((res) => {
        console.log(graph.getAllNodes(), 'graph')
        console.log(graph.getAllEdges(), 'edges')
        console.log(res, 'res')
        const {nodes, edges} = res
        console.log(nodes, 'nodes');
        nodes.forEach((node) => {
          console.log(node, 'node');
          const circle = new Circle({
            style: {
              cx: node.data.x,
              cy: node.data.y,
              r: 10,
              // fill: '#1890FF',
              stroke: '#F04864',
              lineWidth: 4,
            },
          });
          const text = new Text({
            style: {
              dx: node.data.x,
              dy: node.data.y,
              text: node.id,
              fill: 'red',
              textAlign: 'center', // 水平居中
              textBaseline: 'middle', // 垂直居中
            },
          });
          canvas.appendChild(circle);
          canvas.appendChild(text);
        });
        edges.forEach((edge) => {
          const { controlPoints } = edge.data;
          console.log(controlPoints, 'controlPoints');
          const source = nodes.find(({ id }) => id === edge.source);
          const target = nodes.find(({ id }) => id === edge.target);
          const polyline = new Polyline({
            style: {
              stroke: '#F04864',
              strokeWidth: 4,
              points: [
                [source?.data.x, source?.data.y],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // ...controlPoints.map(({ x, y }: any) => [x, y]),
                [target?.data.x, target?.data.y],
              ],
              // markerEnd: true,
            },
          });
          canvas.appendChild(polyline);
        });
        nodes.forEach((node) => {
          const circle = new Circle({
            style: {
              cx: node.data.x,
              cy: node.data.y,
              r: 10,
              // fill: '#1890FF',
              stroke: '#F04864',
              lineWidth: 4,
            },
          });
          const text = new Text({
            style: {
              dx: node.data.x,
              dy: node.data.y,
              text: node.id,
              fill: 'red',
              textAlign: 'center', // 水平居中
              textBaseline: 'middle', // 垂直居中
            },
          });
          canvas.appendChild(circle);
          canvas.appendChild(text);
        });

        edges.forEach((edge) => {
          const { controlPoints } = edge.data;
          console.log(controlPoints, 'controlPoints');
          const source = nodes.find(({ id }) => id === edge.source);
          const target = nodes.find(({ id }) => id === edge.target);
          const polyline = new Polyline({
            style: {
              stroke: '#F04864',
              strokeWidth: 4,
              points: [
                [source?.data.x, source?.data.y],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...controlPoints.map(({ x, y }: any) => [x, y]),
                [target?.data.x, target?.data.y],
              ],
              // markerEnd: true,
            },
          });
          canvas.appendChild(polyline);
        });
      });
    // });
  }, []);
  return <div id="container">1111</div>;
}

export default Test;
