import { useEffect, useReducer } from "react";
import { BrowserShell } from "./components/browser/BrowserShell";
import { createInitialState } from "./game/initialState";
import { loadGame, saveGame } from "./game/persistence";
import { gameReducer } from "./game/reducer";

export function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => loadGame() ?? createInitialState());

  useEffect(() => {
    saveGame(state);
  }, [state]);

  return (
    <main className="app-shell">
      <BrowserShell state={state} dispatch={dispatch} />
    </main>
  );
}
