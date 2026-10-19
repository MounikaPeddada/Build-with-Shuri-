import { Handle, Position } from '@xyflow/react';

// Board size and pin spacing, in px. Every position below derives from these,
// so labels, headers and parts can't drift out of alignment.
const W = 412;
const H = 210;
const STEP = 24;

// Top header, left to right (same order as a real Uno R3): GND, 13…8, a gap, 7…0.
const TOP_PINS = [
  ...['GND', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8'].map((id, i) => ({ id, label: id, x: 42 + i * STEP })),
  ...['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0'].map((id, i) => ({ id, label: id, x: 224 + i * STEP })),
];

// Bottom header: power on the left, analog inputs on the right.
const BOTTOM_PINS = [
  ...[
    { id: '3V3', label: '3.3V' },
    { id: '5V', label: '5V' },
    { id: 'GND', label: 'GND' },
    { id: 'GND2', label: 'GND' },
    { id: 'VIN', label: 'Vin' },
  ].map((p, i) => ({ ...p, x: 130 + i * STEP })),
  ...['A0', 'A1', 'A2', 'A3', 'A4', 'A5'].map((id, i) => ({ id, label: id, x: 262 + i * STEP })),
];

const labelClass =
  'pointer-events-none absolute -translate-x-1/2 text-[9px] font-medium leading-none text-white/90';

export default function ArduinoNode({ selected }) {
  return (
    <div
      className={`relative rounded-lg shadow-lg ring-2 ${selected ? 'ring-[#f4d35e]' : 'ring-[#00415f]'}`}
      style={{ width: W, height: H, backgroundColor: '#005c8a' }}
    >
      {/* Mounting holes */}
      {[
        [16, 16],
        [W - 14, 100],
        [W - 14, 190],
      ].map(([x, y]) => (
        <div
          key={`${x}-${y}`}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 ring-1 ring-white/20"
          style={{ left: x, top: y }}
        />
      ))}

      {/* USB-B port (silver, sticks out of the left edge) */}
      <div className="absolute -left-4 top-10 h-14 w-[50px] rounded-sm bg-slate-300 ring-1 ring-slate-500">
        <div className="absolute inset-x-2 inset-y-3 rounded-[2px] bg-slate-500/70" />
      </div>

      {/* Reset button */}
      <div className="absolute left-[56px] top-[50px] flex h-5 w-5 items-center justify-center rounded-full bg-zinc-300 ring-1 ring-black/40">
        <div className="h-3 w-3 rounded-full bg-red-600" />
      </div>

      {/* DC barrel jack (black, bottom-left) */}
      <div className="absolute -left-3.5 top-[132px] h-[52px] w-[50px] rounded-sm bg-zinc-900 ring-1 ring-black">
        <div className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-zinc-700" />
      </div>

      {/* ATmega328P, centred on the board */}
      <div
        className="absolute flex items-center justify-center rounded-[3px] bg-zinc-900 ring-1 ring-black"
        style={{ left: W / 2 - 65, top: 88, width: 130, height: 34 }}
      >
        <div className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-zinc-600" />
        <span className="text-[9px] font-medium text-zinc-400">ATmega328P</span>
      </div>

      {/* Silkscreen, below the chip and clear of both pin rows */}
      <p
        className="pointer-events-none absolute left-0 right-0 text-center font-semibold leading-none text-white"
        style={{ top: 136, fontSize: 17, letterSpacing: '0.04em' }}
      >
        ARDUINO UNO
      </p>
      <p
        className="pointer-events-none absolute left-0 right-0 text-center text-[10px] leading-none text-white/60"
        style={{ top: 160 }}
      >
        Shuri edition
      </p>

      {/* Top header */}
      {TOP_PINS.map((p) => (
        <div key={p.id}>
          <span className={labelClass} style={{ left: p.x, top: 12 }}>
            {p.label}
          </span>
          <Handle id={p.id} type="source" position={Position.Top} className="pin" style={{ left: p.x }} />
        </div>
      ))}

      {/* Bottom header */}
      {BOTTOM_PINS.map((p) => (
        <div key={p.id}>
          <span className={labelClass} style={{ left: p.x, bottom: 12 }}>
            {p.label}
          </span>
          <Handle id={p.id} type="source" position={Position.Bottom} className="pin" style={{ left: p.x }} />
        </div>
      ))}
    </div>
  );
}
