const LEVELS = {
  error: { dot: 'bg-fail', label: 'Error', ring: 'border-fail/40' },
  warn: { dot: 'bg-warn', label: 'Warning', ring: 'border-warn/40' },
  info: { dot: 'bg-trace', label: 'Tip', ring: 'border-line' },
  ok: { dot: 'bg-good', label: 'All clear', ring: 'border-good/40' },
};

/** Live circuit hints. Soft and non-blocking: they never stop the user from wiring. */
export default function LinterPanel({ hints }) {
  return (
    <ul className="space-y-2 p-3">
      {hints.map((h) => {
        const style = LEVELS[h.level];
        return (
          <li key={h.id} className={`rounded-md border bg-panel-alt p-3 ${style.ring}`}>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} aria-hidden="true" />
              <h3 className="text-sm font-semibold leading-tight">{h.title}</h3>
              <span className="ml-auto text-xs text-muted">{style.label}</span>
            </div>
            <p className="mt-1.5 text-sm leading-snug text-muted">{h.body}</p>
          </li>
        );
      })}
    </ul>
  );
}
