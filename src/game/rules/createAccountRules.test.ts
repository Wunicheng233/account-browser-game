import { describe, expect, it } from "vitest";
import { makeState } from "../../test/fixtures";
import { createAccountRules } from "./createAccountRules";

const byId = Object.fromEntries(createAccountRules.map((rule) => [rule.id, rule]));

describe("create account rules", () => {
  it("validates English-only submitted text", () => {
    const state = makeState({
      profile: { registrationStatement: "I am an ordinary user nihao." },
    });

    expect(byId["create.englishOnly"].check(state).status).toBe("passed");

    const failed = makeState({
      profile: { registrationStatement: "I am an ordinary user 你好." },
    });

    expect(byId["create.englishOnly"].check(failed).status).toBe("failed");
  });

  it("requires the sms code to match current browser code", () => {
    const passed = makeState({
      profile: { smsCode: "482739" },
      browser: { currentSmsCode: "482739" },
    });

    expect(byId["create.smsMatches"].check(passed).status).toBe("passed");

    const failed = makeState({
      profile: { smsCode: "111111" },
      browser: { currentSmsCode: "482739" },
    });

    expect(byId["create.smsMatches"].check(failed).status).toBe("failed");
  });

  it("checks identity card region against account region", () => {
    const state = makeState({
      profile: {
        region: "United States",
        identityCard: {
          name: "Ordinary User",
          birthday: "1990-01-01",
          region: "Canada",
          identityNumber: "ID-123456",
        },
      },
    });

    expect(byId["create.identityRegion"].check(state).status).toBe("failed");
  });
});
