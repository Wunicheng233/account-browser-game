import { describe, expect, it } from "vitest";
import { makeState } from "../../test/fixtures";
import { createAccountRules } from "./createAccountRules";
import { recoverAccountRules } from "./recoverAccountRules";
import { allRules } from "./index";

const bluntSearchPatterns = [
  /Search [^.]+ to find it/i,
  /^Search [^,]+, then/i,
  /^Search .+ to receive/i,
];

function expectNotBluntSearchInstruction(copy: string) {
  for (const pattern of bluntSearchPatterns) {
    expect(copy).not.toMatch(pattern);
  }
}

function ruleMessage(ruleId: string, state = makeState()): string {
  const rule = [...createAccountRules, ...recoverAccountRules].find((candidate) => candidate.id === ruleId);
  if (!rule) throw new Error(`Missing rule ${ruleId}`);
  return rule.check(state).message;
}

describe("rule copy tone", () => {
  it("keeps search clues suggestive instead of direct", () => {
    for (const rule of allRules) {
      expectNotBluntSearchInstruction(rule.description);
    }

    const clueMessages = [
      ruleMessage("create.phoneRegion", makeState({ profile: { region: "United States", phone: "" } })),
      ruleMessage("create.smsMatches", makeState({ profile: { smsCode: "" }, browser: { currentSmsCode: "482739" } })),
      ruleMessage(
        "create.timezone",
        makeState({
          profile: { region: "United States" },
          browser: { timezoneReport: { region: "Taiwan", timezone: "Asia/Taipei", language: "en-US" } },
        }),
      ),
      ruleMessage("create.identityGenerated", makeState({ profile: { identityCard: null } })),
      ruleMessage("recover.ticketFromMailbox"),
      ruleMessage("recover.ticketNoGreeting", makeState({ browser: { mailboxMessages: [] } })),
    ];

    for (const message of clueMessages) {
      expectNotBluntSearchInstruction(message);
    }
  });
});
