// src/lib/nets.js
export function buildNets(edges) {
  const parent = {};
  
  const find = (i) => {
    if (!parent[i]) parent[i] = i;
    if (parent[i] !== i) parent[i] = find(parent[i]);
    return parent[i];
  };
  
  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) parent[rootJ] = rootI;
  };

  // Group by the exact pin handle (e.g., "node_1:anode")
  edges.forEach((e) => {
    const pinA = `${e.source}:${e.sourceHandle}`;
    const pinB = `${e.target}:${e.targetHandle}`;
    union(pinA, pinB);
  });

  const nets = {};
  Object.keys(parent).forEach((pin) => {
    const root = find(pin);
    if (!nets[root]) nets[root] = [];
    nets[root].push(pin);
  });

  return Object.values(nets); 
}