// src/lib/rules/physics.js
const isGnd = (pinHandle) => typeof pinHandle === 'string' && (pinHandle.includes('GND') || pinHandle.includes('cathode'));

export function checkPhysics(nets, nodes) {
  const findings = [];
  
  for (const net of nets) {
    const pins = net.map(pinStr => pinStr.split(':')[1]); // get just the handle name
    
    const has5V = pins.includes('5V');
    const hasGnd = pins.some(isGnd);
    
    if (has5V && hasGnd) {
      findings.push({
        id: `short-${net[0]}`,
        level: 'error',
        title: '5V is wired directly to GND',
        body: 'This is a short circuit. Current has nothing to slow it down, which can damage the board. Remove this wire.',
      });
    }
  }
  return findings;
}