import { SAVE_VERSION } from "./constants";
import type { GameState } from "./types";

export const SAVE_KEY = "account-browser-save";

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GameState;
    return parsed.saveVersion === SAVE_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(SAVE_KEY);
}
