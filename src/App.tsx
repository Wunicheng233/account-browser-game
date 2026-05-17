import { useEffect, useReducer, useState } from "react";
import { BrowserShell } from "./components/browser/BrowserShell";
import { EndingView } from "./components/endings/EndingView";
import { RecoveryBriefing } from "./components/intro/RecoveryBriefing";
import { StoryIntro } from "./components/intro/StoryIntro";
import { createInitialState } from "./game/initialState";
import {
  hasSeenIntro,
  hasSeenRecoveryBriefing,
  loadGame,
  markIntroSeen,
  markRecoveryBriefingSeen,
  saveGame,
} from "./game/persistence";
import { gameReducer } from "./game/reducer";

export function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => loadGame() ?? createInitialState());
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());
  const [dismissedRecoveryBriefingFor, setDismissedRecoveryBriefingFor] = useState<number | null>(null);
  const registrationSuccessAt = state.history.registrationSuccessAt;
  const showRecoveryBriefing =
    !showIntro &&
    state.chapter === "recover" &&
    registrationSuccessAt !== null &&
    dismissedRecoveryBriefingFor !== registrationSuccessAt &&
    !hasSeenRecoveryBriefing(registrationSuccessAt);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  function dismissIntro() {
    markIntroSeen();
    setShowIntro(false);
  }

  function dismissRecoveryBriefing() {
    if (registrationSuccessAt === null) return;
    markRecoveryBriefingSeen(registrationSuccessAt);
    setDismissedRecoveryBriefingFor(registrationSuccessAt);
  }

  if (state.ending) {
    return <EndingView endingId={state.ending} />;
  }

  return (
    <main className="app-shell">
      <BrowserShell state={state} dispatch={dispatch} />
      {showIntro ? <StoryIntro onDismiss={dismissIntro} /> : null}
      {showRecoveryBriefing ? (
        <RecoveryBriefing suspensionReason={state.history.suspensionReason} onDismiss={dismissRecoveryBriefing} />
      ) : null}
    </main>
  );
}
