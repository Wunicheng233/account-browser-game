import type { Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import { getSiteAccess } from "../../game/siteAccess";
import type { GameState } from "../../game/types";
import { CloudySignupSite } from "./CloudySignupSite";
import { IdentitySite } from "./IdentitySite";
import { MailboxSite } from "./MailboxSite";
import { SiteError } from "./SiteError";
import { SmsSite } from "./SmsSite";
import { SearchResultsSite } from "./SearchResultsSite";
import { TimezoneSite } from "./TimezoneSite";

interface SiteViewportProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function SiteViewport({ state, dispatch }: SiteViewportProps) {
  if (state.browser.isLoading) {
    return (
      <div className="site-viewport loading-viewport" aria-live="polite">
        <div className="loading-card">
          <span className="spinner" aria-hidden="true" />
          <h1>Loading secure route</h1>
          <p>Checking proxy posture, local regulations, and whether the page feels emotionally available.</p>
        </div>
      </div>
    );
  }

  if (state.browser.currentUrl === "search.local") {
    return (
      <div className="site-viewport">
        <SearchResultsSite query={state.browser.searchQuery} dispatch={dispatch} />
      </div>
    );
  }

  const access = getSiteAccess(state.browser.currentUrl, state.browser.proxyEnabled);
  if (!access.ok) {
    return (
      <div className="site-viewport">
        <SiteError title={access.title ?? "Site unavailable"} message={access.message ?? "This site cannot be reached."} />
      </div>
    );
  }

  return (
    <div className="site-viewport">
      {state.browser.currentUrl === "cloudyai.signup.fake" ? <CloudySignupSite state={state} dispatch={dispatch} /> : null}
      {state.browser.currentUrl === "sms.local" ? <SmsSite state={state} dispatch={dispatch} /> : null}
      {state.browser.currentUrl === "identity.gov.fake" ? <IdentitySite state={state} dispatch={dispatch} /> : null}
      {state.browser.currentUrl === "mailbox.local" ? <MailboxSite state={state} /> : null}
      {state.browser.currentUrl === "timezone-checker.net" ? <TimezoneSite state={state} /> : null}
    </div>
  );
}
