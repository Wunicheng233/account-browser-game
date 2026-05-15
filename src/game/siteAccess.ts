import type { SiteId } from "./types";

export interface SiteAccess {
  ok: boolean;
  title?: string;
  message?: string;
}

export function getSiteAccess(site: SiteId, proxyEnabled: boolean): SiteAccess {
  if (site === "cloudyai.signup.fake") {
    return proxyEnabled
      ? { ok: true }
      : {
          ok: false,
          title: "Service unavailable",
          message: "This service is unavailable from your current network.",
        };
  }

  if (site === "sms.local") {
    return proxyEnabled
      ? {
          ok: false,
          title: "Route rejected",
          message: "SMS center rejected this route. Please reconnect from a local network.",
        }
      : { ok: true };
  }

  if (site === "identity.gov.fake") {
    return proxyEnabled
      ? {
          ok: false,
          title: "Connection refused",
          message: "Government identity services cannot be accessed through anonymized connections.",
        }
      : { ok: true };
  }

  return { ok: true };
}
