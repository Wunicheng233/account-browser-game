import type { ChangeEvent, Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import type { GameState } from "../../game/types";
import { scoreUsernameSimilarity } from "../../game/usernameSimilarity";

interface SiteProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

type ProfileUpdateField = Extract<GameAction, { type: "profile/update" }>["field"];

function update(dispatch: Dispatch<GameAction>, field: ProfileUpdateField) {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    dispatch({ type: "profile/update", field, value: event.target.value });
  };
}

export function CloudySignupSite({ state, dispatch }: SiteProps) {
  const profile = state.profile;
  const isRecover = state.chapter === "recover";
  const usernameSimilarity = scoreUsernameSimilarity(profile.username);
  const usernameHint =
    profile.username.trim() === ""
      ? null
      : usernameSimilarity.blocked
        ? `Too similar to ${usernameSimilarity.closest}: ${usernameSimilarity.score}%.`
        : `Closest taken username: ${usernameSimilarity.closest} (${usernameSimilarity.score}%).`;

  return (
    <div className="field-stack account-site">
      <header className="site-hero">
        <p className="site-eyebrow">CloudyAI Identity</p>
        <h1>{isRecover ? "CloudyAI Account Recovery" : "CloudyAI Account"}</h1>
        <p>
          {isRecover
            ? "Recover your account by proving the account recovered you first."
            : "Create an account for global productivity."}
        </p>
      </header>

      <section className="account-card" aria-label={isRecover ? "Recovery form" : "Signup form"}>
        <div className="form-grid">
          <input className="field" aria-label="Email" placeholder="Email" value={profile.email} onChange={update(dispatch, "email")} />
          <div className="field-with-hint">
            <input
              className="field"
              aria-describedby={usernameHint ? "username-similarity" : undefined}
              aria-label="Username"
              placeholder="Username"
              value={profile.username}
              onChange={update(dispatch, "username")}
            />
            {usernameHint ? (
              <p id="username-similarity" className={`field-hint${usernameSimilarity.blocked ? " warning" : ""}`}>
                {usernameHint}
              </p>
            ) : null}
          </div>
          <input className="field" aria-label="Password" placeholder="Password" value={profile.password} onChange={update(dispatch, "password")} />
          <select className="field" aria-label="Account region" value={profile.region} onChange={update(dispatch, "region")}>
            <option value="">Choose region</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Taiwan">Taiwan</option>
          </select>
          <input className="field" aria-label="Phone" placeholder="Phone" value={profile.phone} onChange={update(dispatch, "phone")} />
          <input className="field" aria-label="Birthday" type="date" value={profile.birthday} onChange={update(dispatch, "birthday")} />
          <input
            className="field"
            aria-label="Recovery email"
            placeholder="Recovery email"
            value={profile.recoveryEmail}
            onChange={update(dispatch, "recoveryEmail")}
          />
          <input className="field" aria-label="SMS code" placeholder="SMS code" value={profile.smsCode} onChange={update(dispatch, "smsCode")} />
        </div>

        {isRecover ? (
          <>
            <textarea
              className="text-area"
              aria-label="Appeal letter"
              placeholder="Appeal letter"
              value={profile.appealLetter}
              onChange={update(dispatch, "appealLetter")}
            />
            <input
              className="field"
              aria-label="Ticket number"
              placeholder="Ticket number"
              value={profile.ticketNumber}
              onChange={update(dispatch, "ticketNumber")}
            />
            <input
              className="field"
              aria-label="Final identity phrase"
              placeholder="Final identity phrase"
              value={profile.finalIdentityPhrase}
              onChange={update(dispatch, "finalIdentityPhrase")}
            />
            <button type="button" className="primary-button" onClick={() => dispatch({ type: "game/finishRecover" })}>
              Submit appeal
            </button>
          </>
        ) : (
          <>
            <textarea
              className="text-area"
              aria-label="Registration statement"
              placeholder="Registration statement"
              value={profile.registrationStatement}
              onChange={update(dispatch, "registrationStatement")}
            />
            <button type="button" className="primary-button" onClick={() => dispatch({ type: "game/completeCreateAccount", now: Date.now() })}>
              Create Account
            </button>
          </>
        )}
      </section>
    </div>
  );
}
