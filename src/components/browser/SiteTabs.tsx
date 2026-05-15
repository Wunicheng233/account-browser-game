import type { Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import type { GameState, SiteId } from "../../game/types";

interface SiteTabsProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const SITE_LABELS: Record<SiteId, string> = {
  "cloudyai.signup.fake": "CloudyAI",
  "sms.local": "sms.local",
  "identity.gov.fake": "identity.gov.fake",
  "mailbox.local": "mailbox.local",
  "timezone-checker.net": "timezone-checker.net",
};

export function SiteTabs({ state, dispatch }: SiteTabsProps) {
  return (
    <nav className="site-tabs" aria-label="Sites">
      {state.browser.openTabs.map((site) => {
        const isActive = site === state.browser.currentUrl;

        return (
          <button
            type="button"
            key={site}
            className={isActive ? "tab active" : "tab"}
            aria-current={isActive ? "page" : undefined}
            onClick={() => dispatch({ type: "browser/navigate", site })}
          >
            {SITE_LABELS[site]}
          </button>
        );
      })}
    </nav>
  );
}
