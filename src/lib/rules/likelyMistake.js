// src/lib/rules/likelyMistake.js
export function checkLikelyMistakes(nets, nodes, edges) {
  const findings = [];
  const typeById = Object.fromEntries(nodes.map(n => [n.id, n.type]));
  
  // --- COMPONENT-BASED RULES ---
  nodes.forEach(node => {
    if (node.type === 'led') {
      // 1. Find all wires connected to this specific LED
      const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);
      
      // 2. Check what is on the other end of those wires
      let connectsToArduino = false;
      let connectsToResistor = false;

      connectedEdges.forEach(edge => {
        const otherId = edge.source === node.id ? edge.target : edge.source;
        const otherType = typeById[otherId];
        
        if (otherType === 'arduino') connectsToArduino = true;
        if (otherType === 'resistor') connectsToResistor = true;
      });

      // 3. The Rule: If it's connected to an Arduino, it needs a resistor somewhere
      if (connectsToArduino && !connectsToResistor) {
        findings.push({
          id: `no-resistor-${node.id}`,
          level: 'warn',
          title: 'LED has no resistor in series',
          body: 'Wired straight to a board pin, nothing limits the current. The LED can burn out. Put a resistor (about 220 Ω) in the loop.',
        });
      }

      // 4. The Floating leg rule (from earlier)
      if (connectedEdges.length === 1) {
        findings.push({
          id: `open-${node.id}`,
          level: 'warn',
          title: 'LED has only one leg connected',
          body: 'Current needs a complete loop. Connect the other leg (to GND) to complete the circuit.',
        });
      } else if (connectedEdges.length === 0) {
        findings.push({
          id: `unwired-${node.id}`,
          level: 'info',
          title: 'LED isn\'t wired yet',
          body: 'An LED needs a path from a supply pin, through the LED, back to GND.',
        });
      }
    }
  });
  
  // --- NET-BASED RULES (Keeping physics checks separate) ---
  // We can leave the physics checks in physics.js, so nothing else goes here right now.

  return findings;
}