import { describe, expect, it } from "vitest";
import { makeState } from "../test/fixtures";
import { gameReducer } from "./reducer";

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

  it("transitions to recover chapter with a mailbox ticket", () => {
    const state = makeState();
    const next = gameReducer(state, { type: "game/completeCreateAccount", now: 123 });

    expect(next.chapter).toBe("recover");
    expect(next.unlockedRuleIds).toEqual(["recover.salutation"]);
    expect(next.history.registrationSuccessAt).toBe(123);
    expect(next.history.generatedTicketNumber).toMatch(/^CASE-[0-9]{4}$/);
    expect(next.browser.mailboxMessages.at(-1)?.ticketNumber).toBe(next.history.generatedTicketNumber);
  });
});
