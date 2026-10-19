import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { EditorView } from '@codemirror/view';

const theme = EditorView.theme({
  '&': { fontSize: '13px', height: '100%', backgroundColor: '#ffffff' },
  '.cm-content': { fontFamily: '"JetBrains Mono", ui-monospace, monospace', padding: '8px 0' },
  '.cm-gutters': { backgroundColor: '#f4f7f8', color: '#8a9aa3', border: 'none' },
  '.cm-activeLine': { backgroundColor: '#eef4f5' },
  '.cm-activeLineGutter': { backgroundColor: '#e3edee' },
  '&.cm-focused': { outline: 'none' },
});

/** Top-right panel: the Arduino sketch. */
export default function CodeEditor({ value, onChange, onReset, onRun }) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-panel" aria-label="Code editor">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-line bg-panel-alt pl-1 pr-3">
        <span className="border-b-2 border-trace px-3 py-2 font-mono text-[13px] font-medium">sketch.ino</span>
        
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReset}
            className="rounded px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-line hover:text-ink"
          >
            Reset sketch
          </button>
          
          {/* Run button now calls the simulator directly */}
          <button
            type="button"
            onClick={onRun}
            className="rounded-md bg-good px-3 py-1 text-xs font-semibold text-white"
          >
            Run
          </button>
          
          {/* Stop button remains disabled for now */}
          <button
            type="button"
            disabled
            className="rounded-md bg-fail px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
          >
            Stop
          </button>
        </div>
      </div>
      
      <div className="min-h-0 flex-1 overflow-auto">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[cpp(), theme]}
          onChange={onChange}
          basicSetup={{ foldGutter: false, highlightActiveLine: true }}
        />
      </div>
    </section>
  );
}