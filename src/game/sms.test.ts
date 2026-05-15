import { describe, expect, it } from "vitest";
import { digitSum, generateSmsCode, hasConsecutivePairFromCode } from "./sms";

describe("sms helpers", () => {
  it("generates deterministic six digit codes", () => {
    expect(generateSmsCode(12345)).toMatch(/^[0-9]{6}$/);
    expect(generateSmsCode(12345)).toBe(generateSmsCode(12345));
  });

  it("sums digits", () => {
    expect(digitSum("482739")).toBe(33);
  });

  it("detects consecutive digit pairs from the code", () => {
    expect(hasConsecutivePairFromCode("agent27", "482739")).toBe(true);
    expect(hasConsecutivePairFromCode("agent99", "482739")).toBe(false);
  });
});
