import { useEffect, useState, type Dispatch, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, Search, Send, Wifi, WifiOff } from "lucide-react";
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";

interface ToolbarProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function Toolbar({ state, dispatch }: ToolbarProps) {
  const [address, setAddress] = useState(state.browser.addressText);

  useEffect(() => {
    setAddress(state.browser.addressText);
  }, [state.browser.addressText]);

  function submitValue() {
    dispatch({ type: "browser/submitAddress", value: address });
  }

  function submitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitValue();
  }

  function submitOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submitValue();
  }

  return (
    <form className="toolbar" onSubmit={submitAddress}>
      <button type="button" className="icon-button" onClick={() => dispatch({ type: "browser/back" })}>
        <ArrowLeft size={18} aria-hidden="true" />
        <span className="button-label">Back</span>
      </button>
      <label className="address-wrap">
        <span className="address-search-icon" aria-hidden="true">
          <Search size={17} />
        </span>
        <input
          className="address-bar"
          value={address}
          aria-label="Search or enter address"
          placeholder="Search verification code, acceptable identity, recovery mailbox..."
          onChange={(event) => setAddress(event.target.value)}
          onKeyDown={submitOnEnter}
        />
      </label>
      <button type="submit" className="go-button">
        <Send size={16} aria-hidden="true" />
        <span>Go</span>
      </button>
      <button
        type="button"
        className={state.browser.proxyEnabled ? "proxy-toggle active" : "proxy-toggle"}
        aria-pressed={state.browser.proxyEnabled}
        onClick={() => dispatch({ type: "browser/toggleProxy" })}
      >
        {state.browser.proxyEnabled ? <Wifi size={17} aria-hidden="true" /> : <WifiOff size={17} aria-hidden="true" />}
        <span>Proxy {state.browser.proxyEnabled ? "ON" : "OFF"}</span>
      </button>
    </form>
  );
}
