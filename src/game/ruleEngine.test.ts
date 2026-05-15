import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { evaluateRules, unlockNextRuleIds } from "./ruleEngine";

describe("ruleEngine", () => {
  it("evaluates locked and unlocked rules separately", () => {
    const state = makeState({ unlockedRuleIds: ["create.email"] });
    const results = evaluateRules(state);

    expect(results.find((rule) => rule.id === "create.email")?.status).toBe("failed");
    expect(results.find((rule) => rule.id === "create.password")?.status).toBe("locked");
  });

  it("unlocks the next rule when the current rule passes", () => {
    const state = makeState({
      unlockedRuleIds: ["create.email"],
      profile: { email: "ordinary@example.com" },
    });

    expect(unlockNextRuleIds(state)).toContain("create.password");
  });
});
