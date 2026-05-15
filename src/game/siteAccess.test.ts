import { describe, expect, it } from "vitest";
import { getSiteAccess } from "./siteAccess";

describe("getSiteAccess", () => {
  it("requires proxy for the main signup site", () => {
    expect(getSiteAccess("cloudyai.signup.fake", false).ok).toBe(false);
    expect(getSiteAccess("cloudyai.signup.fake", true).ok).toBe(true);
  });

  it("rejects proxy for local SMS and identity sites", () => {
    expect(getSiteAccess("sms.local", true).ok).toBe(false);
    expect(getSiteAccess("identity.gov.fake", true).ok).toBe(false);
    expect(getSiteAccess("sms.local", false).ok).toBe(true);
    expect(getSiteAccess("identity.gov.fake", false).ok).toBe(true);
  });
});
