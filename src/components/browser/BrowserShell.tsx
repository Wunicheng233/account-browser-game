import type { Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";
import { RulePanel } from "../rules/RulePanel";
import { SiteViewport } from "../sites/SiteViewport";
import { SiteTabs } from "./SiteTabs";
import { Toolbar } from "./Toolbar";

interface BrowserShellProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function BrowserShell({ state, dispatch }: BrowserShellProps) {
  return (
    <div className="game-layout">
      <section className="browser-window" aria-label="Fictional browser">
        <Toolbar state={state} dispatch={dispatch} />
        <SiteTabs state={state} dispatch={dispatch} />
        <SiteViewport state={state} dispatch={dispatch} />
      </section>
      <RulePanel state={state} />
    </div>
  );
}
