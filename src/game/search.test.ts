import { describe, expect, it } from "vitest";
import { resolveAddressInput, searchSites } from "./search";

describe("browser search", () => {
  it("resolves direct known addresses", () => {
    expect(resolveAddressInput("sms.local")).toEqual({ type: "site", site: "sms.local" });
  });

  it("finds helper websites from rule hint phrases", () => {
    expect(searchSites("verification code")[0]).toMatchObject({ site: "sms.local" });
    expect(searchSites("phone region")[0]).toMatchObject({ site: "phone-region.local" });
    expect(searchSites("country code")[0]).toMatchObject({ site: "phone-region.local" });
    expect(searchSites("acceptable identity")[0]).toMatchObject({ site: "identity.gov.fake" });
    expect(searchSites("recovery mailbox")[0]).toMatchObject({ site: "mailbox.local" });
    expect(searchSites("timezone report")[0]).toMatchObject({ site: "timezone-checker.net" });
  });

  it("falls back to search results for unknown addresses", () => {
    expect(resolveAddressInput("where do I get a fictional id")).toEqual({
      type: "search",
      query: "where do I get a fictional id",
    });
  });
});
