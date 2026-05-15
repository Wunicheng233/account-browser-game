import { createInitialState } from "../game/initialState";
import type { BrowserState, GameHistory, GameState, Profile } from "../game/types";

interface StateOverrides extends Omit<Partial<GameState>, "profile" | "browser" | "history"> {
  profile?: Partial<Profile>;
  browser?: Partial<BrowserState>;
  history?: Partial<GameHistory>;
}

export function makeState(overrides: StateOverrides = {}): GameState {
  const state = createInitialState(1_700_000_000_000);
  return {
    ...state,
    ...overrides,
    profile: { ...state.profile, ...overrides.profile },
    browser: { ...state.browser, ...overrides.browser },
    history: { ...state.history, ...overrides.history },
  };
}
