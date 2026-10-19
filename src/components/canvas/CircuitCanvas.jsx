import { useCallback } from 'react';
import { Background, BackgroundVariant, ConnectionMode, Controls, ReactFlow, useReactFlow } from '@xyflow/react';
import { nodeTypes } from './nodes';
import { DRAG_MIME } from '../../lib/componentCatalog';
import { WIRE_STYLE } from '../../hooks/useCircuit';

export default function CircuitCanvas({ circuit }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addComponent } = circuit;
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData(DRAG_MIME);
      if (!type) return;
      addComponent(type, screenToFlowPosition({ x: e.clientX, y: e.clientY }));
    },
    [addComponent, screenToFlowPosition],
  );

  return (
    <div className="h-full min-w-0 flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        // Loose mode lets any pin connect to any other pin (parts have no "input" or "output").
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{ type: 'smoothstep', style: WIRE_STYLE }}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.4} color="#27272a" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
