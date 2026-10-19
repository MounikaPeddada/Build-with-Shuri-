import { useCallback, useRef } from 'react';
import { addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { COMPONENT_CATALOG } from '../lib/componentCatalog';

export const WIRE_STYLE = { stroke: '#2dd4bf', strokeWidth: 3 };

// A starter bench: one board, one LED and one resistor, nothing wired yet.
const INITIAL_NODES = [
  { id: 'arduino-1', type: 'arduino', position: { x: 40, y: 150 }, data: { label: 'Arduino Uno' } },
  { id: 'resistor-1', type: 'resistor', position: { x: 540, y: 100 }, data: { label: 'Resistor', value: '220 Ω' } },
  { id: 'led-1', type: 'led', position: { x: 580, y: 230 }, data: { label: 'LED', color: '#e5484d' } },
];

/** Owns the circuit graph (parts + wires) so the canvas and the linter share it. */
export function useCircuit() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const counter = useRef(10);

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge({ ...connection, type: 'smoothstep', style: WIRE_STYLE }, eds),
      ),
    [setEdges],
  );

  // `position` is in canvas coordinates. If omitted (click-to-add), stagger new parts.
  const addComponent = useCallback(
    (type, position) => {
      const def = COMPONENT_CATALOG.find((c) => c.type === type);
      if (!def) return;
      counter.current += 1;
      const n = counter.current;
      setNodes((nds) =>
        nds.concat({
          id: `${type}-${n}`,
          type,
          position: position ?? { x: 80 + (n % 6) * 28, y: 60 + (n % 6) * 28 },
          data: { ...def.data },
        }),
      );
    },
    [setNodes],
  );

  return { nodes, edges, onNodesChange, onEdgesChange, onConnect, addComponent };
}
