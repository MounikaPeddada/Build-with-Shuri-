import { useState } from 'react';
import LinterPanel from './LinterPanel';
import ChatPanel from './ChatPanel';

/** Bottom-right panel with two tabs: live circuit hints and the AI chat. */
export default function AssistantPanel({ hints }) {
  const [tab, setTab] = useState('hints');
  const attention = hints.filter((h) => h.level === 'error' || h.level === 'warn').length;

  const tabClass = (name) =>
    `flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
      tab === name ? 'border-trace text-ink' : 'border-transparent text-muted hover:text-ink'
    }`;

  return (
    <section className="flex h-full min-h-0 flex-col bg-panel" aria-label="Shuri assistant">
      <div role="tablist" className="flex h-10 shrink-0 items-center gap-1 border-b border-line bg-panel-alt pl-1">
        <button role="tab" aria-selected={tab === 'hints'} onClick={() => setTab('hints')} className={tabClass('hints')}>
          Circuit hints
          {attention > 0 && (
            <span className="rounded-full bg-warn px-1.5 text-xs font-semibold leading-5 text-white">{attention}</span>
          )}
        </button>
        <button role="tab" aria-selected={tab === 'chat'} onClick={() => setTab('chat')} className={tabClass('chat')}>
          Ask Shuri
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Both stay mounted so the chat keeps its history when you switch tabs. */}
        <div className={tab === 'hints' ? '' : 'hidden'}>
          <LinterPanel hints={hints} />
        </div>
        <div className={tab === 'chat' ? 'h-full' : 'hidden'}>
          <ChatPanel />
        </div>
      </div>
    </section>
  );
}
