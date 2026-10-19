// Everything the left-hand drawer can place on the canvas.
// `type` must match a key in nodeTypes (components/canvas/nodes/index.js).
export const COMPONENT_CATALOG = [
  {
    type: 'arduino',
    name: 'Arduino Uno',
    hint: 'Board',
    data: { label: 'Arduino Uno' },
  },
  {
    type: 'led',
    name: 'LED',
    hint: 'Red LED',
    data: { label: 'LED', color: '#e5484d' },
  },
  {
    type: 'resistor',
    name: 'Resistor',
    hint: '220 Ω',
    data: { label: 'Resistor', value: '220 Ω' },
  },
];

export const DRAG_MIME = 'application/x-shuri-component';
