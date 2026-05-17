import { describe, expect, it } from "vitest";
import { makeState } from "../../test/fixtures";
import { recoverAccountRules } from "./recoverAccountRules";

const byId = Object.fromEntries(recoverAccountRules.map((rule) => [rule.id, rule]));

describe("recover account rules", () => {
  it("requires suspension reason exactly once", () => {
    const passed = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, I saw unsupported location signal. thank you" },
      history: { suspensionReason: "unsupported location signal" },
    });

    expect(byId["recover.reasonOnce"].check(passed).status).toBe("passed");

    const failed = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, unsupported location signal and unsupported location signal. thank you" },
      history: { suspensionReason: "unsupported location signal" },
    });

    expect(byId["recover.reasonOnce"].check(failed).status).toBe("failed");
  });

  it("checks comma count against registration region changes", () => {
    const state = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, I changed nothing, then I changed nothing again, thank you" },
      history: { regionChangeCount: 2 },
    });

    expect(byId["recover.regionCommas"].check(state).status).toBe("passed");
  });

  it("does not make comma count impossible when the required salutation already has a comma", () => {
    const state = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, unsupported location signal thank you" },
      history: { regionChangeCount: 0 },
    });

    expect(byId["recover.regionCommas"].check(state).status).toBe("passed");
  });

  it("allows required numeric ticket and SMS evidence without pasting the full identity number", () => {
    const state = makeState({
      chapter: "recover",
      profile: {
        appealLetter: "Dear Safeguards Team, unsupported location signal CASE-0123 482739 thank you",
        identityCard: {
          name: "Ordinary User",
          birthday: "1990-01-01",
          region: "United States",
          identityNumber: "FAKE-001907",
        },
      },
    });

    expect(byId["recover.noIdentityDigits"].check(state).status).toBe("passed");
  });

  it("blocks the full identity number in the appeal letter", () => {
    const state = makeState({
      chapter: "recover",
      profile: {
        appealLetter: "Dear Safeguards Team, my number is ID-789000. thank you",
        identityCard: {
          name: "Ordinary User",
          birthday: "1990-01-01",
          region: "United States",
          identityNumber: "ID-789000",
        },
      },
    });

    expect(byId["recover.noIdentityDigits"].check(state).status).toBe("failed");
  });

  it("requires a travel explanation after repeated proxy use", () => {
    const state = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, unsupported location signal. thank you" },
      history: { proxyOnUseCountDuringRegistration: 4 },
    });

    expect(byId["recover.traveling"].check(state)).toMatchObject({
      status: "failed",
      riskTags: ["vpn_energy"],
    });
  });

  it("only tags convenient travel explanations when identity region already matches", () => {
    const matched = makeState({
      chapter: "recover",
      profile: {
        region: "United States",
        appealLetter: "Dear Safeguards Team, I was traveling. thank you",
        identityCard: {
          name: "Ordinary User",
          birthday: "1990-01-01",
          region: "United States",
          identityNumber: "ID-789000",
        },
      },
      history: { proxyOnUseCountDuringRegistration: 4 },
    });

    expect(byId["recover.traveling"].check(matched)).toMatchObject({
      status: "passed",
      riskTags: ["vpn_energy"],
    });

    const mismatched = makeState({
      chapter: "recover",
      profile: {
        region: "United States",
        appealLetter: "Dear Safeguards Team, I was traveling. thank you",
        identityCard: {
          name: "Ordinary User",
          birthday: "1990-01-01",
          region: "Canada",
          identityNumber: "ID-789000",
        },
      },
      history: { proxyOnUseCountDuringRegistration: 4 },
    });

    expect(byId["recover.traveling"].check(mismatched)).toEqual({
      status: "passed",
      message: "Travel explanation accepted but marked as unusually convenient.",
    });
  });

  it("does not require or tag travel explanations for limited proxy use", () => {
    const state = makeState({
      chapter: "recover",
      profile: { appealLetter: "Dear Safeguards Team, unsupported location signal. thank you" },
      history: { proxyOnUseCountDuringRegistration: 3 },
    });

    expect(byId["recover.traveling"].check(state)).toEqual({
      status: "passed",
      message: "Travel explanation not required.",
    });
  });
});
