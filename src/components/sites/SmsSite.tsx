import { useEffect, type Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import { digitSum } from "../../game/sms";
import type { GameState } from "../../game/types";

interface SiteProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function SmsSite({ state, dispatch }: SiteProps) {
  const code = state.browser.currentSmsCode;

  useEffect(() => {
    const delay = Math.max(0, state.browser.smsRefreshAt - Date.now());
    const timer = window.setTimeout(() => {
      const now = Date.now();
      dispatch({ type: "sms/refresh", seed: now, now });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [dispatch, state.browser.smsRefreshAt]);

  return (
    <div className="site-card">
      <h1>SMS Local Center</h1>
      <p>The system is currently pretending this code was sent somewhere:</p>
      <strong className="code-display">{code}</strong>
      <p>Digit sum, because arithmetic is trust: {digitSum(code)}</p>
      <button type="button" className="secondary-button" onClick={() => dispatch({ type: "sms/refresh", seed: Date.now(), now: Date.now() })}>
        Ask for a newer truth
      </button>
    </div>
  );
}
