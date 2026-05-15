import { describe, expect, it } from "vitest";
import { createInitialState } from "./initialState";

describe("createInitialState", () => {
  it("starts in the create account chapter on the signup site", () => {
    const state = createInitialState();

    expect(state.chapter).toBe("create");
    expect(state.browser.currentUrl).toBe("cloudyai.signup.fake");
    expect(state.browser.proxyEnabled).toBe(false);
    expect(state.unlockedRuleIds).toEqual(["create.email"]);
    expect(state.riskTags).toEqual([]);
    expect(state.ending).toBeNull();
  });

  it("uses fresh mutable collections on each call", () => {
    const first = createInitialState();
    const second = createInitialState();

    first.riskTags.push("vpn_energy");
    first.browser.history.push("sms.local");

    expect(second.riskTags).toEqual([]);
    expect(second.browser.history).toEqual([]);
  });
});
