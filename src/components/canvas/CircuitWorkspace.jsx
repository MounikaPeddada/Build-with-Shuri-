import ComponentDrawer from './ComponentDrawer';
import CircuitCanvas from './CircuitCanvas';

/** Left half of the screen: part drawer + circuit canvas. */
export default function CircuitWorkspace({ circuit, displayNodes }) {
  return (
    <section className="flex h-full min-h-0 bg-[#09090b]" aria-label="Circuit canvas">
      <ComponentDrawer onAdd={circuit.addComponent} />
      {/* Pass displayNodes down to the canvas */}
      <CircuitCanvas circuit={circuit} displayNodes={displayNodes} />
    </section>
  );
}