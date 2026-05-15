import { SAVE_VERSION, SUPPORTED_REGIONS } from "./constants";
import type { Chapter, EndingId, GameState, SupportedRegion } from "./types";

export const SAVE_KEY = "account-browser-save";

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isChapter(value: unknown): value is Chapter {
  return value === "create" || value === "recover";
}

function isEnding(value: unknown): value is EndingId | null {
  return (
    value === null ||
    value === "recovered" ||
    value === "read_only_human" ||
    value === "appeal_pending" ||
    value === "account_exists_user_does_not" ||
    value === "thank_you_for_understanding"
  );
}

function hasStringFields(value: Record<string, unknown>, fields: string[]): boolean {
  return fields.every((field) => isString(value[field]));
}

function isSupportedRegion(value: unknown): value is SupportedRegion {
  return isString(value) && SUPPORTED_REGIONS.includes(value as SupportedRegion);
}

function isValidIdentityCard(value: unknown): boolean {
  if (!isObject(value)) return false;

  return (
    isString(value.name) &&
    isString(value.birthday) &&
    isString(value.identityNumber) &&
    isSupportedRegion(value.region)
  );
}

function isValidProfile(value: unknown): boolean {
  if (!isObject(value)) return false;

  return (
    hasStringFields(value, [
      "email",
      "username",
      "password",
      "region",
      "phone",
      "birthday",
      "recoveryEmail",
      "registrationStatement",
      "appealLetter",
      "smsCode",
      "ticketNumber",
      "finalIdentityPhrase",
    ]) &&
    (value.identityCard === null || isValidIdentityCard(value.identityCard))
  );
}

function isValidBrowser(value: unknown): boolean {
  if (!isObject(value)) return false;

  return (
    isString(value.currentUrl) &&
    Array.isArray(value.history) &&
    typeof value.proxyEnabled === "boolean" &&
    Array.isArray(value.openTabs) &&
    isString(value.currentSmsCode) &&
    isNumber(value.smsRequiredTotal) &&
    isNumber(value.smsRefreshAt) &&
    Array.isArray(value.mailboxMessages) &&
    isObject(value.timezoneReport)
  );
}

function isStringOrNull(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isNumberOrNull(value: unknown): value is number | null {
  return value === null || isNumber(value);
}

function isValidHistory(value: unknown): boolean {
  if (!isObject(value)) return false;

  return (
    isNumber(value.regionChangeCount) &&
    isNumber(value.proxyOnUseCountDuringRegistration) &&
    isNumber(value.smsFailureCount) &&
    isStringOrNull(value.firstSuccessfulSmsCode) &&
    isNumberOrNull(value.registrationSuccessAt) &&
    isString(value.suspensionReason) &&
    isStringOrNull(value.firstAppealLetter) &&
    isStringOrNull(value.generatedTicketNumber) &&
    Array.isArray(value.generatedIdentityCards) &&
    value.generatedIdentityCards.every(isValidIdentityCard)
  );
}

function isValidSavedGame(value: unknown): value is GameState {
  if (!isObject(value)) return false;

  return (
    value.saveVersion === SAVE_VERSION &&
    isChapter(value.chapter) &&
    isValidProfile(value.profile) &&
    isValidBrowser(value.browser) &&
    isValidHistory(value.history) &&
    Array.isArray(value.unlockedRuleIds) &&
    Array.isArray(value.riskTags) &&
    Array.isArray(value.systemLog) &&
    isEnding(value.ending)
  );
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isValidSavedGame(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(SAVE_KEY);
}
