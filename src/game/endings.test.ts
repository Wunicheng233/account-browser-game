import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { chooseEnding } from "./endings";

describe("chooseEnding", () => {
  it("returns recovered for a low-risk completed state", () => {
    const state = makeState({
      chapter: "recover",
      riskTags: [],
      unlockedRuleIds: ["recover.complete"],
    });

    expect(chooseEnding(state)).toBe("recovered");
  });

  it("returns account exists user does not for identity loop and region mismatch", () => {
    const state = makeState({
      chapter: "recover",
      riskTags: ["identity_loop", "region_mismatch"],
      unlockedRuleIds: ["recover.complete"],
    });

    expect(chooseEnding(state)).toBe("account_exists_user_does_not");
  });
});
