import { describe, expect, it, beforeEach } from "vitest";
import { createInitialState } from "./initialState";
import { loadGame, saveGame } from "./persistence";

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
    localStorage.setItem("account-browser-save", "{not json");

    expect(loadGame()).toBeNull();
  });
});
