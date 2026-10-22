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
import { parseHex } from './lib/hexParser';
import { poweredLeds } from './lib/ledPower';

export default function App() {
  const circuit = useCircuit();
  const [code, setCode] = useState(DEFAULT_SKETCH);
  const [sim, setSim] = useState(null);
  
  // 1. Track the live state of the pins coming from the simulator
  const [pinStates, setPinStates] = useState({});

  const hints = useMemo(() => evaluateRules(circuit.nodes, circuit.edges), [circuit.nodes, circuit.edges]);

  // 2. Calculate which LEDs are powered based on the live graph and pin states
  const ledOn = useMemo(
    () => poweredLeds(circuit.nodes, circuit.edges, pinStates),
    [circuit.nodes, circuit.edges, pinStates]
  );

  // 3. Create a "display" version of the nodes that React Flow will render
  const displayNodes = useMemo(
    () => circuit.nodes.map((n) => 
      n.type === 'led' ? { ...n, data: { ...n.data, isOn: !!ledOn[n.id] } } : n
    ),
    [circuit.nodes, ledOn]
  );

  const handleRunSimulation = async () => {
    console.log("1. Run clicked - sending code to FastAPI...");
    
    if (sim) {
      console.log("Stopping old sim");
      sim.stop();
      setPinStates({}); // Reset pins
    }

    try {
      // Send code to the FastAPI backend for real compilation
      const response = await fetch("http://localhost:8000/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });

      const data = await response.json();
      
      if (data.status === "error") {
        console.error("Compilation failed:\n", data.message);
        return; // TODO: Show this in the UI
      }

      console.log("2. Compilation successful! Parsing hex...");
      const program = parseHex(data.hex_content);

      // Create the simulator with the real compiled program
      const newSim = new ArduinoSimulator(program, (pin, isHigh) => {
        const pinName = `D${pin}`; // e.g., D13
        // Only update state if it actually changed to prevent spam
        setPinStates((prev) => 
          prev[pinName] === isHigh ? prev : { ...prev, [pinName]: isHigh }
        );
      });
      
      console.log("3. Simulator created, starting...");
      setSim(newSim);
      newSim.start();
    } catch (error) {
      console.error("Backend connection error (Is uvicorn running?):", error);
    }
  };

  const handleStopSimulation = () => {
    if (sim) {
      sim.stop();
      setSim(null);
      setPinStates({});
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
                  onStop={handleStopSimulation} // Added Stop handler just in case
                />
              }
              second={<AssistantPanel hints={hints} />}
            />
          }
          // 4. Pass the derived displayNodes to the workspace
          second={<CircuitWorkspace circuit={circuit} displayNodes={displayNodes} />}
        />
      </main>
    </div>
  );
}