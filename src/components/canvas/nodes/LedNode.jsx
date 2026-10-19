import { Handle, Position } from '@xyflow/react';

export default function LedNode({ data, selected }) {
  const color = data?.color ?? '#e5484d';
  return (
    <div className="relative h-16 w-14">
      <svg width="56" height="64" viewBox="0 0 56 64" aria-label="LED">
        {selected && (
          <rect x="2" y="2" width="52" height="60" rx="8" fill="none" stroke="#f4d35e" strokeWidth="2" strokeDasharray="4 3" />
        )}
        {/* legs: anode (left) is the longer one */}
        <line x1="20" y1="38" x2="20" y2="64" stroke="#8a96a0" strokeWidth="3" strokeLinecap="round" />
        <line x1="36" y1="38" x2="36" y2="56" stroke="#8a96a0" strokeWidth="3" strokeLinecap="round" />
        {/* body */}
        <path d="M13 34 V21 a15 15 0 0 1 30 0 V34 Z" fill={color} fillOpacity="0.9" stroke="#17262e" strokeWidth="1.5" />
        <rect x="9" y="33" width="38" height="6" rx="2" fill={color} stroke="#17262e" strokeWidth="1.5" />
        <ellipse cx="22" cy="16" rx="4" ry="6" fill="#fff" fillOpacity="0.45" />
      </svg>

      <span className="pointer-events-none absolute -bottom-5 left-[20px] -translate-x-1/2 text-[11px] font-semibold text-zinc-400">+</span>
      <span className="pointer-events-none absolute -bottom-5 left-[36px] -translate-x-1/2 text-[11px] font-semibold text-zinc-400">−</span>

      <Handle id="anode" type="source" position={Position.Bottom} className="pin" style={{ left: 20 }} />
      <Handle id="cathode" type="source" position={Position.Bottom} className="pin" style={{ left: 36, bottom: 8 }} />
    </div>
  );
}
