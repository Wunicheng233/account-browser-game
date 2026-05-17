import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { chooseEnding } from "./endings";
import { recoverAccountRules } from "./rules/recoverAccountRules";

const allRecoverRuleIds = recoverAccountRules.map((rule) => rule.id);

function makeCompletedRecoveryState(overrides: Parameters<typeof makeState>[0] = {}) {
  const { profile: profileOverrides, history: historyOverrides, browser: browserOverrides, ...stateOverrides } = overrides;
  const ticketNumber = "REC-42";
  const profile = {
    email: "ordinary@example.com",
    username: "agentx",
    region: "United States" as const,
    birthday: "1990-01-01",
    recoveryEmail: "ordinary@backup.com",
    ticketNumber,
    smsCode: "482739",
    appealLetter:
      "Dear Safeguards Team, unsupported location signal REC-42 I did not create multiple accounts, 482739, thank you",
    finalIdentityPhrase: `ordinary@example.com agentx United States ${ticketNumber}`,
    identityCard: {
      name: "Ordinary User",
      birthday: "1990-01-01",
      region: "Canada" as const,
      identityNumber: "ID-",
    },
    ...profileOverrides,
  };

  return makeState({
    chapter: "recover",
    riskTags: [],
    unlockedRuleIds: allRecoverRuleIds,
    ...stateOverrides,
    profile,
    history: {
      suspensionReason: "unsupported location signal",
      regionChangeCount: 2,
      firstSuccessfulSmsCode: "482739",
      proxyOnUseCountDuringRegistration: 3,
      ...historyOverrides,
    },
    browser: {
      mailboxMessages: [
        {
          id: "message-1",
          subject: "Recovery ticket",
          greetingPhrase: "Hello applicant",
          body: "Ticket REC-42",
          ticketNumber,
          createdAt: 1,
        },
      ],
      ...browserOverrides,
    },
  });
}

describe("chooseEnding", () => {
  it("returns appeal pending for an incomplete no-risk recovery state", () => {
    const state = makeState({
      chapter: "recover",
      riskTags: [],
      unlockedRuleIds: ["recover.salutation"],
    });

    expect(chooseEnding(state)).toBe("appeal_pending");
  });

  it("returns recovered for a low-risk completed state", () => {
    const state = makeCompletedRecoveryState();

    expect(chooseEnding(state)).toBe("recovered");
  });

  it("returns account exists user does not for identity loop and region mismatch", () => {
    const state = makeCompletedRecoveryState({
      riskTags: ["identity_loop", "region_mismatch"],
    });

    expect(chooseEnding(state)).toBe("account_exists_user_does_not");
  });

  it("prioritizes account existence ending over other high-risk combinations", () => {
    const state = makeCompletedRecoveryState({
      riskTags: ["identity_loop", "region_mismatch", "appeal_tone_unclear", "too_determined"],
    });

    expect(chooseEnding(state)).toBe("account_exists_user_does_not");
  });
});
