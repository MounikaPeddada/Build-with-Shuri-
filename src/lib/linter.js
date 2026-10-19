// Live circuit linter (rule engine, v0). Pure function: nodes + edges in, hints out.
// Runs in the browser on every change, so keep every rule cheap.
//
// A hint looks like: { id, level: 'error' | 'warn' | 'info' | 'ok', title, body }

const isGnd = (pin) => typeof pin === 'string' && pin.startsWith('GND');

const LEVEL_ORDER = { error: 0, warn: 1, info: 2, ok: 3 };

export function lintCircuit(nodes, edges) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const hints = [];

  // Everything wired to one pin of one part: [{ node, pin }]
  const linksOf = (nodeId, pinId) =>
    edges.flatMap((e) => {
      if (e.source === nodeId && e.sourceHandle === pinId) {
        return [{ node: byId.get(e.target), pin: e.targetHandle }];
      }
      if (e.target === nodeId && e.targetHandle === pinId) {
        return [{ node: byId.get(e.source), pin: e.sourceHandle }];
      }
      return [];
    });

  const onArduino = (links, test = () => true) =>
    links.some((l) => l.node?.type === 'arduino' && test(l.pin));

  if (edges.length === 0) {
    return [
      {
        id: 'empty',
        level: 'info',
        title: 'Start wiring',
        body: 'Drag from one pin to another to draw a wire. Select a wire or part and press Backspace to delete it.',
      },
    ];
  }

  // Rule 1: 5V wired straight to GND
  for (const e of edges) {
    const s = byId.get(e.source);
    const t = byId.get(e.target);
    if (s?.type === 'arduino' && t?.type === 'arduino') {
      const pins = [e.sourceHandle, e.targetHandle];
      if (pins.includes('5V') && pins.some(isGnd)) {
        hints.push({
          id: `short-${e.id}`,
          level: 'error',
          title: '5V is wired directly to GND',
          body: 'This is a short circuit. Current has nothing to slow it down, which can damage the board. Remove this wire.',
        });
      }
    }
  }

  // Rules 2-4: per LED
  nodes
    .filter((n) => n.type === 'led')
    .forEach((led, i) => {
      const name = `LED ${i + 1}`;
      const anode = linksOf(led.id, 'anode');
      const cathode = linksOf(led.id, 'cathode');

      if (anode.length === 0 && cathode.length === 0) {
        hints.push({
          id: `unwired-${led.id}`,
          level: 'info',
          title: `${name} isn't wired yet`,
          body: 'An LED needs a path from a supply pin, through the LED, back to GND.',
        });
        return;
      }

      if (anode.length === 0 || cathode.length === 0) {
        hints.push({
          id: `open-${led.id}`,
          level: 'info',
          title: `${name} has only one leg connected`,
          body: 'Current needs a complete loop. Connect the other leg too.',
        });
      }

      const reversed =
        onArduino(anode, isGnd) ||
        onArduino(cathode, (p) => p === '5V');
      if (reversed) {
        hints.push({
          id: `reversed-${led.id}`,
          level: 'warn',
          title: `${name} looks backwards`,
          body: 'Current enters the anode (+, longer leg) and leaves through the cathode (−). An LED wired the other way round stays dark.',
        });
      }

      if (onArduino(anode) && onArduino(cathode)) {
        hints.push({
          id: `no-resistor-${led.id}`,
          level: 'warn',
          title: `${name} has no resistor in series`,
          body: 'Wired straight between two board pins, nothing limits the current. The LED can burn out. Put a resistor (about 220 Ω) in the loop.',
        });
      }
    });

  if (hints.length === 0) {
    hints.push({
      id: 'ok',
      level: 'ok',
      title: 'No problems found',
      body: 'Every check passed. Real simulation arrives in a later step.',
    });
  }

  return hints.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
}
