import ArduinoNode from './ArduinoNode';
import LedNode from './LedNode';
import ResistorNode from './ResistorNode';

// Defined once, outside any component, so React Flow doesn't re-register them each render.
export const nodeTypes = {
  arduino: ArduinoNode,
  led: LedNode,
  resistor: ResistorNode,
};
