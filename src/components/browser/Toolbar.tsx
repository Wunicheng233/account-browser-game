import { useEffect, useState, type Dispatch, type FormEvent, type KeyboardEvent } from "react";
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
        Back
      </button>
      <label className="address-wrap">
        <span className="address-search-icon" aria-hidden="true">
          Search
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
        Go
      </button>
      <button type="button" className="proxy-toggle" onClick={() => dispatch({ type: "browser/toggleProxy" })}>
        Proxy {state.browser.proxyEnabled ? "ON" : "OFF"}
      </button>
    </form>
  );
}
