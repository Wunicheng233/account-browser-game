import {
  FORBIDDEN_STATEMENT_WORDS,
  REGION_PHONE_PREFIX,
  ROMANIZED_NEUTRALITY_WORDS,
  SPONSOR_NAMES,
  SUPPORTED_REGIONS,
} from "../constants";
import { digitSum, hasConsecutivePairFromCode } from "../sms";
import type { RuleContext, RuleResult, SupportedRegion } from "../types";
import { scoreUsernameSimilarity } from "../usernameSimilarity";

export const pass = (message: string): RuleResult => ({ status: "passed", message });
export const fail = (message: string, riskTags: RuleResult["riskTags"] = []): RuleResult => ({
  status: "failed",
  message,
  riskTags,
});

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isEnglishOnly(value: string): boolean {
  return /^[\x09\x0a\x0d\x20-\x7e]*$/.test(value);
}

export function ageFromBirthday(value: string, now = new Date("2026-05-15T00:00:00Z")): number {
  const birthday = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(birthday.getTime())) return 0;
  let age = now.getUTCFullYear() - birthday.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - birthday.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < birthday.getUTCDate())) {
    age -= 1;
  }
  return age;
}

export function emailDomain(value: string): string {
  return value.split("@")[1]?.toLowerCase() ?? "";
}

export function isSupportedRegion(value: string): value is SupportedRegion {
  return SUPPORTED_REGIONS.includes(value as SupportedRegion);
}

export function passwordIsStrong(value: string): boolean {
  return value.length >= 12 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value);
}

export function statementHasForbiddenWord(value: string): boolean {
  const lower = value.toLowerCase();
  return FORBIDDEN_STATEMENT_WORDS.some((word) => new RegExp(`\\b${word}\\b`, "i").test(lower));
}

export function statementHasRomanizedWord(value: string): boolean {
  const lower = value.toLowerCase();
  return ROMANIZED_NEUTRALITY_WORDS.some((word) => new RegExp(`\\b${word}\\b`, "i").test(lower));
}

export function passwordHasSponsor(value: string): boolean {
  return SPONSOR_NAMES.some((name) => value.includes(name));
}

export function phoneMatchesRegion(phone: string, region: string): boolean {
  return isSupportedRegion(region) && phone.trim().startsWith(REGION_PHONE_PREFIX[region]);
}

export function timezoneMatchesRegion(context: RuleContext): boolean {
  return context.profile.region !== "" && context.browser.timezoneReport.region === context.profile.region;
}

export const createChecks = {
  usernameAvailable: (username: string) => !scoreUsernameSimilarity(username).blocked,
  smsDigitSum: (context: RuleContext) => digitSum(context.profile.smsCode) === context.browser.smsRequiredTotal,
  usernameHasSmsPair: (context: RuleContext) =>
    hasConsecutivePairFromCode(context.profile.username, context.browser.currentSmsCode),
};
