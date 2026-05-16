import { DEFAULT_TABS } from "./constants";
import type { SiteId } from "./types";

export interface SearchResult {
  site: SiteId;
  title: string;
  url: SiteId;
  description: string;
  keywords: string[];
}

export type AddressResolution =
  | { type: "site"; site: SiteId }
  | { type: "search"; query: string };

export const SEARCH_RESULTS: SearchResult[] = [
  {
    site: "cloudyai.signup.fake",
    title: "CloudyAI Account Desk",
    url: "cloudyai.signup.fake",
    description: "Account creation, recovery, and a form quietly measuring the weight of your existence.",
    keywords: ["cloudyai", "account", "signup", "login", "appeal", "safeguards"],
  },
  {
    site: "sms.local",
    title: "SMS Local Center",
    url: "sms.local",
    description: "Local verification codes, digit sums, and other temporary truths.",
    keywords: ["sms", "verification", "verification code", "code", "digit sum", "phone"],
  },
  {
    site: "phone-region.local",
    title: "Phone Region Guide",
    url: "phone-region.local",
    description: "Country calling codes for the regions CloudyAI is willing to recognize today.",
    keywords: ["phone", "phone region", "country code", "calling code", "phone country code", "region phone"],
  },
  {
    site: "identity.gov.fake",
    title: "Department of Acceptable Identity",
    url: "identity.gov.fake",
    description: "Fictional identity cards for compatibility testing. Official enough to be confusing.",
    keywords: ["identity", "acceptable identity", "fictional id", "government", "card", "document"],
  },
  {
    site: "mailbox.local",
    title: "Recovery Mailbox",
    url: "mailbox.local",
    description: "Ticket numbers, automated greetings, and the newest reason you exist incorrectly.",
    keywords: ["mail", "mailbox", "recovery mailbox", "ticket", "case", "email"],
  },
  {
    site: "timezone-checker.net",
    title: "Timezone Checker",
    url: "timezone-checker.net",
    description: "Reports where the network thinks you are, which is now apparently part of your personality.",
    keywords: ["timezone", "timezone report", "network location", "clock", "region"],
  },
];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function resolveAddressInput(value: string): AddressResolution {
  const query = value.trim();
  const normalized = normalize(query);
  const directSite = DEFAULT_TABS.find((site) => normalize(site) === normalized);

  if (directSite) {
    return { type: "site", site: directSite };
  }

  return { type: "search", query };
}

export function searchSites(query: string): SearchResult[] {
  const normalized = normalize(query);
  if (!normalized) return [];

  return SEARCH_RESULTS.map((result) => {
    const haystack = [result.title, result.url, result.description, ...result.keywords].join(" ").toLowerCase();
    const keywordMatch = result.keywords.some((keyword) => normalized.includes(keyword) || keyword.includes(normalized));
    const score = keywordMatch ? 2 : haystack.includes(normalized) ? 1 : 0;
    return { result, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map(({ result }) => result);
}
