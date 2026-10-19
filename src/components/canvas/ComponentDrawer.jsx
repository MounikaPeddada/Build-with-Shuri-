import { COMPONENT_CATALOG, DRAG_MIME } from '../../lib/componentCatalog';

function Preview({ type }) {
  if (type === 'arduino') {
    return (
      <svg viewBox="0 0 48 32" className="h-8 w-12" aria-hidden="true">
        <rect x="2" y="3" width="44" height="26" rx="4" fill="#0b7a85" />
        <rect x="18" y="12" width="14" height="8" rx="1" fill="#17262e" />
        <rect x="-2" y="11" width="9" height="10" rx="1" fill="#cbd5db" />
      </svg>
    );
  }
  if (type === 'led') {
    return (
      <svg viewBox="0 0 48 32" className="h-8 w-12" aria-hidden="true">
        <line x1="20" y1="20" x2="20" y2="31" stroke="#8a96a0" strokeWidth="2" />
        <line x1="28" y1="20" x2="28" y2="27" stroke="#8a96a0" strokeWidth="2" />
        <path d="M15 19 V12 a9 9 0 0 1 18 0 V19 Z" fill="#e5484d" stroke="#17262e" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-hidden="true">
      <line x1="2" y1="16" x2="46" y2="16" stroke="#8a96a0" strokeWidth="2" />
      <rect x="12" y="9" width="24" height="14" rx="6" fill="#e8d7b0" stroke="#17262e" />
      <rect x="17" y="9.5" width="3" height="13" fill="#d33f3f" />
      <rect x="22" y="9.5" width="3" height="13" fill="#d33f3f" />
      <rect x="27" y="9.5" width="3" height="13" fill="#7a4a21" />
    </svg>
  );
}

export default function ComponentDrawer({ onAdd }) {
  return (
    <aside className="flex w-44 shrink-0 flex-col border-r border-[#27272a] bg-[#0f0f12] text-zinc-100">
      <h2 className="border-b border-[#27272a] px-3 py-2.5 text-sm font-semibold">Components</h2>
      <ul className="flex-1 space-y-2 overflow-y-auto p-2">
        {COMPONENT_CATALOG.map((item) => (
          <li key={item.type}>
            <button
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(DRAG_MIME, item.type);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onClick={() => onAdd(item.type)}
              title="Drag onto the canvas, or click to add"
              className="flex w-full cursor-grab items-center gap-2.5 rounded-md border border-[#27272a] bg-[#18181b] px-2 py-2 text-left transition-colors hover:border-trace active:cursor-grabbing"
            >
              <Preview type={item.type} />
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-tight">{item.name}</span>
                <span className="block truncate text-xs text-zinc-400">{item.hint}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="border-t border-[#27272a] p-3 text-xs leading-snug text-zinc-500">
        Drag a part onto the canvas, or click it to add. Drag from pin to pin to wire.
      </p>
    </aside>
  );
}
