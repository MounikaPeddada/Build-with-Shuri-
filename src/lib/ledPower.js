// src/lib/ledPower.js
const key = (nodeId, pinId) => `${nodeId}:${pinId}`;

// Wires connect pins. A resistor also conducts between its two ends.
function buildGraph(nodes, edges) {
  const adj = new Map();
  const link = (a, b) => {
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push(b);
    adj.get(b).push(a);
  };
  
  // Connect the wires
  for (const e of edges) link(key(e.source, e.sourceHandle), key(e.target, e.targetHandle));
  
  // Connect the resistor legs internally
  for (const n of nodes) {
    if (n.type === 'resistor') {
      link(key(n.id, 'a'), key(n.id, 'b'));
      // Check what handles your resistor node actually uses (e.g., '1' and '2' or 'a' and 'b')
      // If your resistor uses 'left' and 'right', change it here!
    }
  }
  return adj;
}

// Every pin you can reach from `start` by following wires and resistors.
function reachable(adj, start) {
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    for (const next of adj.get(queue.shift()) ?? []) {
      if (!seen.has(next)) { seen.add(next); queue.push(next); }
    }
  }
  return seen;
}

export function poweredLeds(nodes, edges, pinStates) {
  const arduino = nodes.find((n) => n.type === 'arduino');
  const result = {};
  if (!arduino) return result;

  const adj = buildGraph(nodes, edges);
  const touches = (set, test) =>
    [...set].some((k) => k.startsWith(`${arduino.id}:`) && test(k.slice(arduino.id.length + 1)));

  for (const led of nodes.filter((n) => n.type === 'led')) {
    // Find all pins reachable from the LED's anode and cathode
    const fromAnode = reachable(adj, key(led.id, 'anode'));
    const fromCathode = reachable(adj, key(led.id, 'cathode'));
    
    // Check if anode reaches a HIGH pin or 5V
    const anodeHigh = touches(fromAnode, (pin) => pin === '5V' || pinStates[pin] === true);
    
    // Check if cathode reaches GND
    const cathodeGrounded = touches(fromCathode, (pin) => pin.startsWith('GND'));

    result[led.id] = anodeHigh && cathodeGrounded;
  }
  return result;
}