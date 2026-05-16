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
          message: "CloudyAI cannot see you from this network. Try arriving with a more internationally polished posture.",
        };
  }

  if (site === "sms.local") {
    return proxyEnabled
      ? {
          ok: false,
          title: "Route rejected",
          message: "SMS Local Center distrusts routes with dramatic travel stories. Local numbers prefer local drama.",
        }
      : { ok: true };
  }

  if (site === "identity.gov.fake") {
    return proxyEnabled
      ? {
          ok: false,
          title: "Connection refused",
          message: "The identity counter refuses visitors in a network trench coat. Very traditional, very modern.",
        }
      : { ok: true };
  }

  return { ok: true };
}
