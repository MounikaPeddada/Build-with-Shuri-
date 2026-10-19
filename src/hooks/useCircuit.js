import { useCallback, useRef, useEffect } from 'react'; // Added useEffect
import { addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { COMPONENT_CATALOG } from '../lib/componentCatalog';

export const WIRE_STYLE = { stroke: '#2dd4bf', strokeWidth: 3 };

const INITIAL_NODES = [
  { id: 'arduino-1', type: 'arduino', position: { x: 40, y: 150 }, data: { label: 'Arduino Uno' } },
  { id: 'resistor-1', type: 'resistor', position: { x: 540, y: 100 }, data: { label: 'Resistor', value: '220 Ω' } },
  { id: 'led-1', type: 'led', position: { x: 580, y: 230 }, data: { label: 'LED', color: '#e5484d' } },
];

// 1. Helper functions to load from localStorage
const loadNodes = () => {
  try {
    const saved = localStorage.getItem('shuri_circuit_nodes');
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  } catch {
    return INITIAL_NODES;
  }
};

const loadEdges = () => {
  try {
    const saved = localStorage.getItem('shuri_circuit_edges');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export function useCircuit() {
  // 2. Initialize the state using the loaders
  const [nodes, setNodes, onNodesChange] = useNodesState(loadNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadEdges());
  const counter = useRef(10);

  // 3. Save to localStorage whenever nodes or edges change
  useEffect(() => {
    localStorage.setItem('shuri_circuit_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('shuri_circuit_edges', JSON.stringify(edges));
  }, [edges]);

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge({ ...connection, type: 'smoothstep', style: WIRE_STYLE }, eds),
      ),
    [setEdges],
  );

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

  // Optional: Add a reset function if you ever want to clear the board
  const resetCircuit = useCallback(() => {
    setNodes(INITIAL_NODES);
    setEdges([]);
    localStorage.removeItem('shuri_circuit_nodes');
    localStorage.removeItem('shuri_circuit_edges');
  }, [setNodes, setEdges]);

  return { nodes, edges, onNodesChange, onEdgesChange, onConnect, addComponent, resetCircuit };
}