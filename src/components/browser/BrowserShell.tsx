import { useEffect, type Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";
import { RulePanel } from "../rules/RulePanel";
import { SiteViewport } from "../sites/SiteViewport";
import { Toolbar } from "./Toolbar";

interface BrowserShellProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function BrowserShell({ state, dispatch }: BrowserShellProps) {
  useEffect(() => {
    if (!state.browser.isLoading) return undefined;

    const timer = window.setTimeout(() => {
      dispatch({ type: "browser/loadComplete" });
    }, 360);

    return () => window.clearTimeout(timer);
  }, [dispatch, state.browser.currentUrl, state.browser.isLoading, state.browser.proxyEnabled]);

  return (
    <div className="game-layout">
      <section className="browser-window" aria-label="Fictional browser">
        <Toolbar state={state} dispatch={dispatch} />
        <SiteViewport state={state} dispatch={dispatch} />
      </section>
      <RulePanel state={state} />
    </div>
  );
}
