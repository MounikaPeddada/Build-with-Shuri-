import { Handle, Position } from '@xyflow/react';

// Colour bands for 220 Ω: red, red, brown, then a gold tolerance band.
const BANDS = ['#d33f3f', '#d33f3f', '#7a4a21', '#c9a227'];

export default function ResistorNode({ data, selected }) {
  return (
    <div className="relative h-7 w-[110px]">
      <svg width="110" height="28" viewBox="0 0 110 28" aria-label="Resistor">
        {selected && (
          <rect x="1" y="1" width="108" height="26" rx="8" fill="none" stroke="#f4d35e" strokeWidth="2" strokeDasharray="4 3" />
        )}
        <line x1="0" y1="14" x2="110" y2="14" stroke="#8a96a0" strokeWidth="3" strokeLinecap="round" />
        <rect x="22" y="4" width="66" height="20" rx="9" fill="#e8d7b0" stroke="#17262e" strokeWidth="1.5" />
        {BANDS.map((c, i) => (
          <rect key={i} x={32 + i * 11 + (i === 3 ? 6 : 0)} y="4.8" width="5" height="18.4" fill={c} />
        ))}
      </svg>

      <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-zinc-400">
        {data?.value ?? '220 Ω'}
      </span>

      <Handle id="a" type="source" position={Position.Left} className="pin" />
      <Handle id="b" type="source" position={Position.Right} className="pin" />
    </div>
  );
}
