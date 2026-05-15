import type { Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";

interface SiteViewportProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function SiteViewport({ state }: SiteViewportProps) {
  return (
    <div className="site-viewport">
      <h1>{state.browser.currentUrl}</h1>
    </div>
  );
}
