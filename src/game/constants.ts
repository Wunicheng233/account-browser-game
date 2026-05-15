import type { SiteId, SupportedRegion } from "./types";

export const SAVE_VERSION = 1;

export const SUPPORTED_REGIONS: SupportedRegion[] = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Taiwan",
];

export const REGION_PHONE_PREFIX: Record<SupportedRegion, string> = {
  "United States": "+1",
  Canada: "+1",
  "United Kingdom": "+44",
  Australia: "+61",
  Taiwan: "+886",
};

export const REGION_TIMEZONE: Record<SupportedRegion, string> = {
  "United States": "America/Los_Angeles",
  Canada: "America/Toronto",
  "United Kingdom": "Europe/London",
  Australia: "Australia/Sydney",
  Taiwan: "Asia/Taipei",
};

export const DEFAULT_TABS: SiteId[] = [
  "cloudyai.signup.fake",
  "sms.local",
  "identity.gov.fake",
  "mailbox.local",
  "timezone-checker.net",
];

export const SPONSOR_NAMES = ["Gloogle", "CloudyAI", "PearHub"] as const;
export const FORBIDDEN_STATEMENT_WORDS = ["need", "urgent", "vpn", "proxy", "mainland"];
export const ROMANIZED_NEUTRALITY_WORDS = ["nihao", "xiexie", "meiyou"];
export const TAKEN_USERNAMES = ["ordinaryuser", "globaltraveler", "alex2026", "cloudfan", "openaccess"];
export const SUSPENSION_REASON = "unsupported location signal";
