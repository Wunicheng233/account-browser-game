import type { Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";

interface ToolbarProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function Toolbar({ state, dispatch }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button type="button" className="icon-button" onClick={() => dispatch({ type: "browser/back" })}>
        Back
      </button>
      <input className="address-bar" value={state.browser.currentUrl} readOnly aria-label="Address" />
      <button type="button" className="proxy-toggle" onClick={() => dispatch({ type: "browser/toggleProxy" })}>
        Proxy {state.browser.proxyEnabled ? "ON" : "OFF"}
      </button>
    </div>
  );
}
