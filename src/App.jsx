import { useMemo, useState } from 'react';
import TopBar from './components/layout/TopBar';
import SplitPane from './components/layout/SplitPane';
import CircuitWorkspace from './components/canvas/CircuitWorkspace';
import CodeEditor from './components/editor/CodeEditor';
import AssistantPanel from './components/assistant/AssistantPanel';
import { useCircuit } from './hooks/useCircuit';
import { evaluateRules } from './lib/rules';
import { DEFAULT_SKETCH } from './lib/defaultSketch';
import { ArduinoSimulator } from './lib/simulator';

export default function App() {
  const circuit = useCircuit();
  const { setNodes } = circuit; 
  const [code, setCode] = useState(DEFAULT_SKETCH);
  const hints = useMemo(() => evaluateRules(circuit.nodes, circuit.edges), [circuit.nodes, circuit.edges]);
  const [sim, setSim] = useState(null);

  const handleRunSimulation = () => {
    console.log("1. Run clicked");
    
    // Stop old sim
    if (sim) {
      console.log("Stopping old sim");
      sim.stop();
    }

    try {
      const newSim = new ArduinoSimulator((pin, isHigh) => {
        console.log(`2. Pin ${pin} changed to ${isHigh ? 'HIGH' : 'LOW'}`);
        if (pin === 13) {
          setNodes((nds) => nds.map(node => {
            if (node.type === 'led') {
              return { ...node, data: { ...node.data, isOn: isHigh } };
            }
            return node;
          }));
        }
      });
      
      console.log("3. Simulator created, starting...");
      setSim(newSim);
      newSim.start();
    } catch (error) {
      console.error("Simulator crashed:", error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <main className="min-h-0 flex-1">
        <SplitPane
          direction="horizontal"
          initial={0.4}
          min={0.25}
          max={0.6}
          first={
            <SplitPane
              direction="vertical"
              initial={0.55}
              min={0.25}
              max={0.8}
              first={
                <CodeEditor 
                  value={code} 
                  onChange={setCode} 
                  onReset={() => setCode(DEFAULT_SKETCH)} 
                  onRun={handleRunSimulation} 
                />
              }
              second={<AssistantPanel hints={hints} />}
            />
          }
          second={<CircuitWorkspace circuit={circuit} />}
        />
      </main>
    </div>
  );
}