import { describe, expect, it } from "vitest";
import { scoreUsernameSimilarity } from "./usernameSimilarity";

describe("scoreUsernameSimilarity", () => {
  it("normalizes digits and punctuation", () => {
    const result = scoreUsernameSimilarity("global.traveler_2026");

    expect(result.closest).toBe("globaltraveler");
    expect(result.blocked).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it("blocks edit distance two or less", () => {
    const result = scoreUsernameSimilarity("openacces");

    expect(result.closest).toBe("openaccess");
    expect(result.blocked).toBe(true);
  });

  it("allows unrelated usernames", () => {
    const result = scoreUsernameSimilarity("harmlessdesk42");

    expect(result.blocked).toBe(false);
    expect(result.score).toBeLessThan(70);
  });
});
