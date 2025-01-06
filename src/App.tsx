import LogicFlow from '@logicflow/core';
import '@logicflow/core/dist/index.css';
import { Layout } from './packages/layout';
import { useEffect, useMemo, useRef } from 'react';
import { Button } from 'antd';

export default function App() {
  const refContainer = useRef(null);
  const lfRef = useRef<LogicFlow>();
  const data = useMemo(() => {
    return {
      // 节点
      nodes: [
        {
          id: '21',
          type: 'rect',
          x: 300,
          y: 100,
          text: 'rect node21',
        },
        {
          id: '50',
          type: 'circle',
          x: 500,
          y: 100,
          text: 'circle node50',
        },
        {
          id: '51',
          type: 'circle',
          x: 400,
          y: 200,
          text: 'circle node51',
        },
        {
          id: '52',
          type: 'circle',
          x: 200,
          y: 200,
          text: 'circle node52',
        },
        {
          id: '53',
          type: 'circle',
          x: 200,
          y: 200,
          text: 'circle node52',
        },
      ],
      // 边
      edges: [
        {
          type: 'polyline',
          sourceNodeId: '21',
          targetNodeId: '50',
        },
        {
          type: 'polyline',
          sourceNodeId: '21',
          targetNodeId: '51',
        },
        {
          type: 'polyline',
          sourceNodeId: '21',
          targetNodeId: '52',
        },
        {
          type: 'polyline',
          sourceNodeId: '53',
          targetNodeId: '21',
        },
      ],
    };
  }, []);
  useEffect(() => {
    const lf = new LogicFlow({
      container: refContainer.current,
      grid: true,
      height: 500,
      plugins: [Layout],
    });
    lf.render(data);
    lf.translateCenter();
    lfRef.current = lf;
  }, [data]);

  return (
    <>
      <Button onClick={() => (lfRef.current.extension.Layout as unknown as Layout).layout()}>自动布局</Button>
      <div className="App" ref={refContainer}></div>
    </>
  );
}
