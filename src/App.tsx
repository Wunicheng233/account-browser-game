import { useEffect, useReducer, useState } from "react";
import { BrowserShell } from "./components/browser/BrowserShell";
import { EndingView } from "./components/endings/EndingView";
import { StoryIntro } from "./components/intro/StoryIntro";
import { createInitialState } from "./game/initialState";
import { hasSeenIntro, loadGame, markIntroSeen, saveGame } from "./game/persistence";
import { gameReducer } from "./game/reducer";

export function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => loadGame() ?? createInitialState());
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());

  useEffect(() => {
    saveGame(state);
  }, [state]);

  function dismissIntro() {
    markIntroSeen();
    setShowIntro(false);
  }

  if (state.ending) {
    return <EndingView endingId={state.ending} />;
  }

  return (
    <main className="app-shell">
      <BrowserShell state={state} dispatch={dispatch} />
      {showIntro ? <StoryIntro onDismiss={dismissIntro} /> : null}
    </main>
  );
}
