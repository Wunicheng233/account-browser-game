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
      profile: { appealLetter: "Dear Safeguards Team, I changed nothing, thank you" },
      history: { regionChangeCount: 2 },
    });

    expect(byId["recover.regionCommas"].check(state).status).toBe("passed");
  });

  it("blocks digits from the identity number in the appeal letter", () => {
    const state = makeState({
      chapter: "recover",
      profile: {
        appealLetter: "Dear Safeguards Team, my number includes 7. thank you",
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
});
