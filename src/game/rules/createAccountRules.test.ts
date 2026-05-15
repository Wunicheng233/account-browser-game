import { describe, expect, it } from "vitest";
import { makeState } from "../../test/fixtures";
import { createAccountRules } from "./createAccountRules";

const byId = Object.fromEntries(createAccountRules.map((rule) => [rule.id, rule]));
const allCreateRuleIds = createAccountRules.map((rule) => rule.id);

function makeAllUnlockedValidCreateState() {
  return makeState({
    unlockedRuleIds: allCreateRuleIds,
    profile: {
      email: "ordinary@example.com",
      username: "agent27safe",
      password: "P@sswordCloudyAI27",
      region: "United States",
      phone: "+1 555 0100",
      birthday: "1990-01-01",
      recoveryEmail: "ordinary@backup.com",
      registrationStatement: "I am an ordinary user with nihao context for safe productivity and calm global access.",
      smsCode: "482739",
      identityCard: {
        name: "Ordinary User",
        birthday: "1990-01-01",
        region: "United States",
        identityNumber: "ID-123456",
      },
    },
    browser: {
      currentSmsCode: "482739",
      smsRequiredTotal: 33,
    },
  });
}

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

  it("passes completion when all unlocked create rules pass", () => {
    const state = makeAllUnlockedValidCreateState();

    expect(byId["create.complete"].check(state).status).toBe("passed");
  });

  it("fails completion when an earlier unlocked create rule is broken", () => {
    const state = makeAllUnlockedValidCreateState();
    state.profile.email = "not-an-email";

    expect(byId["create.complete"].check(state).status).toBe("failed");
  });

  it("explains the closest taken username when similarity blocks registration", () => {
    const state = makeAllUnlockedValidCreateState();
    state.profile.username = "globaltraveler27";

    expect(byId["create.usernameSimilarity"].check(state)).toMatchObject({
      status: "failed",
      message: "Too similar to globaltraveler: 100%.",
    });
  });

  it("requires a non-empty username before checking originality", () => {
    const state = makeAllUnlockedValidCreateState();
    state.profile.username = "";

    expect(byId["create.usernameSimilarity"].check(state)).toMatchObject({
      status: "failed",
      message: "Username cannot be empty.",
    });
  });
});
