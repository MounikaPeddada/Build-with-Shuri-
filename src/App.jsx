import { useMemo, useState } from 'react';
import TopBar from './components/layout/TopBar';
import SplitPane from './components/layout/SplitPane';
import CircuitWorkspace from './components/canvas/CircuitWorkspace';
import CodeEditor from './components/editor/CodeEditor';
import AssistantPanel from './components/assistant/AssistantPanel';
import { useCircuit } from './hooks/useCircuit';
import { evaluateRules } from './lib/rules';
import { DEFAULT_SKETCH } from './lib/defaultSketch';

export default function App() {
  const circuit = useCircuit();
  const [code, setCode] = useState(DEFAULT_SKETCH);
  const hints = useMemo(() => evaluateRules(circuit.nodes, circuit.edges), [circuit.nodes, circuit.edges]);

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <main className="min-h-0 flex-1">
        <SplitPane
          direction="horizontal"
          initial={0.4}
          min={0.25}
          max={0.6}
          // LEFT: code on top, Shuri (hints + chat) below
          first={
            <SplitPane
              direction="vertical"
              initial={0.55}
              min={0.25}
              max={0.8}
              first={<CodeEditor value={code} onChange={setCode} onReset={() => setCode(DEFAULT_SKETCH)} />}
              second={<AssistantPanel hints={hints} />}
            />
          }
          // RIGHT: component catalog + circuit canvas
          second={<CircuitWorkspace circuit={circuit} />}
        />
      </main>
    </div>
  );
}
