import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { gameReducer } from "./reducer";
import { createAccountRules } from "./rules/createAccountRules";
import { recoverAccountRules } from "./rules/recoverAccountRules";

const allCreateRuleIds = createAccountRules.map((rule) => rule.id);
const allRecoverRuleIds = recoverAccountRules.map((rule) => rule.id);

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

function makeCompletedRecoverState() {
  const ticketNumber = "REC-42";
  return makeState({
    chapter: "recover",
    riskTags: [],
    unlockedRuleIds: allRecoverRuleIds,
    profile: {
      email: "ordinary@example.com",
      username: "agentx",
      region: "United States",
      birthday: "1990-01-01",
      recoveryEmail: "ordinary@backup.com",
      ticketNumber,
      smsCode: "482739",
      appealLetter:
        "Dear Safeguards Team, unsupported location signal REC-42 I did not create multiple accounts 482739, thank you",
      finalIdentityPhrase: `ordinary@example.com agentx United States ${ticketNumber}`,
      identityCard: {
        name: "Ordinary User",
        birthday: "1990-01-01",
        region: "Canada",
        identityNumber: "ID-",
      },
    },
    history: {
      suspensionReason: "unsupported location signal",
      regionChangeCount: 2,
      firstSuccessfulSmsCode: "482739",
      proxyOnUseCountDuringRegistration: 3,
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
    },
  });
}

describe("gameReducer", () => {
  it("tracks region changes", () => {
    const state = makeState({ profile: { region: "United States" } });
    const next = gameReducer(state, { type: "profile/update", field: "region", value: "Canada" });

    expect(next.profile.region).toBe("Canada");
    expect(next.history.regionChangeCount).toBe(1);
  });

  it("tracks proxy usage during registration", () => {
    const state = makeState({ chapter: "create", browser: { proxyEnabled: false } });
    const next = gameReducer(state, { type: "browser/toggleProxy" });

    expect(next.browser.proxyEnabled).toBe(true);
    expect(next.history.proxyOnUseCountDuringRegistration).toBe(1);
  });

  it("transitions valid completed create state to recover chapter with a mailbox ticket", () => {
    const state = makeAllUnlockedValidCreateState();
    const next = gameReducer(state, { type: "game/completeCreateAccount", now: 123 });

    expect(next.chapter).toBe("recover");
    expect(next.unlockedRuleIds).toEqual(["recover.salutation"]);
    expect(next.history.registrationSuccessAt).toBe(123);
    expect(next.history.generatedTicketNumber).toMatch(/^CASE-[0-9]{4}$/);
    expect(next.browser.mailboxMessages.at(-1)?.ticketNumber).toBe(next.history.generatedTicketNumber);
  });

  it("does not transition incomplete create state to recover", () => {
    const state = makeState();
    const next = gameReducer(state, { type: "game/completeCreateAccount", now: 123 });

    expect(next.chapter).toBe("create");
    expect(next.history.registrationSuccessAt).toBeNull();
    expect(next.history.generatedTicketNumber).toBeNull();
    expect(next.browser.mailboxMessages).toHaveLength(0);
  });

  it("does not finish recovery from create chapter", () => {
    const state = makeState();
    const next = gameReducer(state, { type: "game/finishRecover" });

    expect(next.ending).toBeNull();
  });

  it("does not finish incomplete recovery", () => {
    const state = makeState({ chapter: "recover", unlockedRuleIds: ["recover.salutation"] });
    const next = gameReducer(state, { type: "game/finishRecover" });

    expect(next.ending).toBeNull();
  });

  it("finishes completed recovery", () => {
    const state = makeCompletedRecoverState();
    const next = gameReducer(state, { type: "game/finishRecover" });

    expect(next.ending).toBe("recovered");
  });
});
