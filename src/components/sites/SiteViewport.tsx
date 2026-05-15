import type { Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import { getSiteAccess } from "../../game/siteAccess";
import type { GameState } from "../../game/types";
import { CloudySignupSite } from "./CloudySignupSite";
import { IdentitySite } from "./IdentitySite";
import { MailboxSite } from "./MailboxSite";
import { SiteError } from "./SiteError";
import { SmsSite } from "./SmsSite";
import { TimezoneSite } from "./TimezoneSite";

interface SiteViewportProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export function SiteViewport({ state, dispatch }: SiteViewportProps) {
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
