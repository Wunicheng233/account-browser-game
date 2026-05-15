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

  it("returns null for saved data with a malformed profile identity card", () => {
    const state = createInitialState();
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        ...state,
        profile: {
          ...state.profile,
          identityCard: {},
        },
      }),
    );

    expect(loadGame()).toBeNull();
  });

  it("returns null for saved data with unknown browser sites", () => {
    const state = createInitialState();
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        ...state,
        browser: {
          ...state.browser,
          currentUrl: "unknown.example",
        },
      }),
    );

    expect(loadGame()).toBeNull();
  });

  it("returns null for saved data with malformed mailbox messages", () => {
    const state = createInitialState();
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        ...state,
        browser: {
          ...state.browser,
          mailboxMessages: [{ id: "mail-1" }],
        },
      }),
    );

    expect(loadGame()).toBeNull();
  });

  it("loads saved data with a valid identity card", () => {
    const state = createInitialState();
    const identityCard = {
      name: "Ordinary User",
      birthday: "1990-01-01",
      region: "United States",
      identityNumber: "ID-123456",
    };

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        ...state,
        profile: {
          ...state.profile,
          identityCard,
        },
        history: {
          ...state.history,
          generatedIdentityCards: [identityCard],
        },
      }),
    );

    expect(loadGame()?.profile.identityCard).toEqual(identityCard);
  });

  it("returns null for version mismatch", () => {
    const state = createInitialState();
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, saveVersion: 0 }));

    expect(loadGame()).toBeNull();
  });
});
