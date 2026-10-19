import { useEffect, useRef, useState } from 'react';

const SUGGESTIONS = ['Explain this circuit', 'Why does an LED need a resistor?', 'What does pin 13 do?'];

const GREETING = {
  id: 0,
  role: 'assistant',
  text: 'Hi! Wire up your circuit and ask me what any connection does, or why a hint appeared.',
};

/**
 * Chat UI only. `reply()` is the single place to swap in the AI gateway later
 * (POST the question + circuit + sketch, return the answer).
 */
async function reply() {
  return "I'm not connected to the AI service yet. Once I am, I'll answer here using your circuit and your sketch.";
}

export default function ChatPanel() {
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const nextId = useRef(1);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const send = async (text) => {
    const question = text.trim();
    if (!question || busy) return;
    setMessages((m) => [...m, { id: nextId.current++, role: 'user', text: question }]);
    setDraft('');
    setBusy(true);
    const answer = await reply(question);
    setMessages((m) => [...m, { id: nextId.current++, role: 'assistant', text: answer }]);
    setBusy(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ul className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3">
        {messages.map((m) => (
          <li key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex'}>
            <p
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-snug ${
                m.role === 'user' ? 'bg-trace text-white' : 'border border-line bg-panel-alt'
              }`}
            >
              {m.text}
            </p>
          </li>
        ))}
        <li ref={endRef} aria-hidden="true" />
      </ul>

      <div className="shrink-0 border-t border-line p-2.5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setDraft(s)}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-muted transition-colors hover:border-trace hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
            rows={2}
            placeholder="Ask Shuri about your circuit…"
            aria-label="Ask Shuri"
            className="min-h-0 flex-1 resize-none rounded-md border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-trace"
          />
          <button
            type="button"
            onClick={() => send(draft)}
            disabled={!draft.trim() || busy}
            className="rounded-md bg-trace px-3.5 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
