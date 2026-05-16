import { useEffect, type Dispatch } from "react";
import { Clock3, Globe2, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
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

  const stageLabel = state.chapter === "create" ? "Create Account" : "Recover Account";
  const pageLabel = state.browser.currentUrl === "search.local" ? "Search" : state.browser.currentUrl;

  return (
    <div className="game-layout">
      <aside className="game-rail" aria-label="Workspace navigation">
        <div className="rail-brand" aria-hidden="true">
          AB
        </div>
        <div className="rail-icons" aria-hidden="true">
          <span className="rail-icon active">
            <Globe2 size={20} />
          </span>
          <span className={state.profile.smsCode ? "rail-icon active" : "rail-icon"}>
            <KeyRound size={20} />
          </span>
          <span className={state.profile.identityCard ? "rail-icon active" : "rail-icon"}>
            <ShieldCheck size={20} />
          </span>
          <span className={state.browser.mailboxMessages.length > 0 ? "rail-icon active" : "rail-icon"}>
            <MailCheck size={20} />
          </span>
          <span className="rail-icon">
            <Clock3 size={20} />
          </span>
        </div>
      </aside>

      <section className="workspace-panel" aria-label="Account browser workspace">
        <header className="workspace-header">
          <div>
            <p className="workspace-eyebrow">Account Browser</p>
            <h1>Cloudy Compliance Console</h1>
          </div>
          <div className="workspace-status" aria-label="Browser status">
            <span className={state.browser.proxyEnabled ? "workspace-badge success" : "workspace-badge warning"}>
              Proxy {state.browser.proxyEnabled ? "ON" : "OFF"}
            </span>
            <span className="workspace-badge secondary">{stageLabel}</span>
            <span className="workspace-badge secondary">{pageLabel}</span>
          </div>
        </header>

        <section className="browser-window" aria-label="Fictional browser">
          <Toolbar state={state} dispatch={dispatch} />
          <SiteViewport state={state} dispatch={dispatch} />
        </section>
      </section>

      <RulePanel state={state} />
    </div>
  );
}
