# Build with Shuri: Step 1 (frontend skeleton)

Split-screen workspace: circuit canvas (left), code editor (top right), circuit hints + assistant chat (bottom right).
No simulation, compiling or AI calls yet.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Structure

```
src/
  App.jsx                         page layout + shared state (code, circuit, hints)
  hooks/useCircuit.js             circuit graph: parts, wires, add/connect
  lib/
    linter.js                     rule engine v0 (pure function: nodes + edges -> hints)
    componentCatalog.js           parts the drawer offers
    defaultSketch.js              starter Arduino code
  components/
    layout/   TopBar, SplitPane   draggable dividers (mouse + arrow keys)
    canvas/   CircuitWorkspace, ComponentDrawer, CircuitCanvas
      nodes/  ArduinoNode, LedNode, ResistorNode
    editor/   CodeEditor          CodeMirror, C++ highlighting
    assistant/ AssistantPanel, LinterPanel, ChatPanel
```

## Where the next steps plug in

- **Add a part:** add an entry to `componentCatalog.js`, a node in `canvas/nodes/`, and register it in `nodes/index.js`.
- **Add a hint:** add a rule inside `lib/linter.js`.
- **Connect the AI:** replace `reply()` in `ChatPanel.jsx` with a call to your backend.
- **Run button:** wired up in `TopBar.jsx` when the compile service and emulator exist.
