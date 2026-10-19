import { useRef, useState } from 'react';

/**
 * Two panes with a draggable divider. Works for both directions:
 *   horizontal = side by side, vertical = stacked.
 * `initial`, `min`, `max` are fractions (0–1) of the container given to the first pane.
 */
export default function SplitPane({ direction = 'horizontal', initial = 0.5, min = 0.2, max = 0.8, first, second }) {
  const isRow = direction === 'horizontal';
  const [ratio, setRatio] = useState(initial);
  const box = useRef(null);
  const dragging = useRef(false);

  const clamp = (r) => Math.min(max, Math.max(min, r));

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current || !box.current) return;
    const rect = box.current.getBoundingClientRect();
    setRatio(clamp(isRow ? (e.clientX - rect.left) / rect.width : (e.clientY - rect.top) / rect.height));
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  // Keyboard support: arrow keys nudge the divider.
  const onKeyDown = (e) => {
    const step = 0.03;
    const back = isRow ? 'ArrowLeft' : 'ArrowUp';
    const forward = isRow ? 'ArrowRight' : 'ArrowDown';
    if (e.key === back) setRatio((r) => clamp(r - step));
    if (e.key === forward) setRatio((r) => clamp(r + step));
  };

  return (
    <div ref={box} className={`flex h-full w-full ${isRow ? 'flex-row' : 'flex-col'}`}>
      <div className="min-h-0 min-w-0 overflow-hidden" style={{ [isRow ? 'width' : 'height']: `${ratio * 100}%` }}>
        {first}
      </div>

      <div
        role="separator"
        aria-orientation={isRow ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={Math.round(min * 100)}
        aria-valuemax={Math.round(max * 100)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        className={`group relative z-10 shrink-0 touch-none bg-line transition-colors hover:bg-trace focus-visible:bg-trace ${
          isRow ? 'w-1.5 cursor-col-resize' : 'h-1.5 cursor-row-resize'
        }`}
      />

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{second}</div>
    </div>
  );
}
