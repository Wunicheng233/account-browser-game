import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { collectRiskTags, evaluateRules, unlockNextRuleIds } from "./ruleEngine";

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

  it("unlocks through already-passing rules until the first unmet rule", () => {
    const state = makeState({
      unlockedRuleIds: ["create.email"],
      profile: {
        email: "ordinary@example.com",
        password: "P@sswordCloudyAI27",
      },
    });

    expect(unlockNextRuleIds(state)).toEqual([
      "create.email",
      "create.password",
      "create.englishOnly",
      "create.usernameSimilarity",
    ]);
  });

  it("collects risk tags from failed unlocked rules", () => {
    const state = makeState({
      unlockedRuleIds: ["create.phoneRegion"],
      profile: { region: "United States", phone: "+44 20 0000 0000" },
    });

    expect(collectRiskTags(state)).toContain("region_mismatch");
  });
});
