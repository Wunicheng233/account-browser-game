import type { Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import type { GameState, IdentityCard, SupportedRegion } from "../../game/types";

interface SiteProps {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

function makeIdentityCard(state: GameState): IdentityCard {
  const region = (state.profile.region || "United States") as SupportedRegion;
  const birthday = state.profile.birthday || "1990-01-01";
  const seed = `${state.profile.email}-${state.profile.username}-${birthday}-${region}`;
  const digits = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0);
  return {
    name: state.profile.username || "Ordinary User",
    birthday,
    region,
    identityNumber: `FAKE-${String(digits).padStart(6, "0")}`,
  };
}

export function IdentitySite({ state, dispatch }: SiteProps) {
  const card = state.profile.identityCard;

  return (
    <div className="site-card">
      <h1>Department of Acceptable Identity</h1>
      <p>Issue a fictional identity card for compatibility testing.</p>
      <button type="button" className="primary-button" onClick={() => dispatch({ type: "identity/generate", card: makeIdentityCard(state) })}>
        Generate fictional card
      </button>
      {card ? (
        <dl className="identity-card">
          <dt>Name</dt>
          <dd>{card.name}</dd>
          <dt>Birthday</dt>
          <dd>{card.birthday}</dd>
          <dt>Region</dt>
          <dd>{card.region}</dd>
          <dt>Identity number</dt>
          <dd>{card.identityNumber}</dd>
        </dl>
      ) : null}
    </div>
  );
}
