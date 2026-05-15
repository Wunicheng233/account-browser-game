import { describe, expect, it, beforeEach } from "vitest";
import { createInitialState } from "./initialState";
import { loadGame, saveGame, SAVE_KEY } from "./persistence";

describe("persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and loads matching save versions", () => {
    const state = createInitialState();
    const saved = { ...state, systemLog: ["saved"] };

    saveGame(saved);

    expect(loadGame()?.systemLog).toEqual(["saved"]);
  });

  it("returns null for invalid saved data", () => {
    localStorage.setItem(SAVE_KEY, "{not json");

    expect(loadGame()).toBeNull();
  });

  it("returns null for malformed same-version saved data", () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ saveVersion: 1 }));

    expect(loadGame()).toBeNull();
  });

  it("returns null for same-version saved data with malformed nested state", () => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        saveVersion: 1,
        chapter: "create",
        profile: {},
        browser: {},
        history: {},
        unlockedRuleIds: ["create.complete"],
        riskTags: [],
        systemLog: [],
        ending: null,
      }),
    );

    expect(loadGame()).toBeNull();
  });

  it("returns null for version mismatch", () => {
    const state = createInitialState();
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, saveVersion: 0 }));

    expect(loadGame()).toBeNull();
  });
});
