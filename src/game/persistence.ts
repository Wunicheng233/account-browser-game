import { SAVE_VERSION } from "./constants";
import type { GameState } from "./types";

export const SAVE_KEY = "account-browser-save";

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidSavedGame(value: unknown): value is GameState {
  if (!isObject(value)) return false;

  return (
    value.saveVersion === SAVE_VERSION &&
    typeof value.chapter === "string" &&
    isObject(value.profile) &&
    isObject(value.browser) &&
    isObject(value.history) &&
    Array.isArray(value.unlockedRuleIds) &&
    Array.isArray(value.riskTags) &&
    Array.isArray(value.systemLog) &&
    "ending" in value
  );
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isValidSavedGame(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(SAVE_KEY);
}
