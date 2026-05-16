import { REGION_TIMEZONE } from "./constants";
import { chooseEnding } from "./endings";
import { collectRiskTags, evaluateRules, unlockNextRuleIds } from "./ruleEngine";
import { recoverAccountRules } from "./rules/recoverAccountRules";
import { resolveAddressInput } from "./search";
import { generateSmsCode } from "./sms";
import type { GameState, IdentityCard, PageId, Profile, SiteId, SupportedRegion } from "./types";

type StringProfileField = {
  [Field in keyof Profile]: Profile[Field] extends string ? Field : never;
}[keyof Profile];

export type GameAction =
  | { type: "profile/update"; field: StringProfileField; value: string }
  | { type: "browser/navigate"; site: SiteId }
  | { type: "browser/submitAddress"; value: string }
  | { type: "browser/loadComplete" }
  | { type: "browser/back" }
  | { type: "browser/toggleProxy" }
  | { type: "sms/refresh"; seed: number; now: number }
  | { type: "identity/generate"; card: IdentityCard }
  | { type: "rules/recheck" }
  | { type: "game/completeCreateAccount"; now: number }
  | { type: "game/finishRecover" };

function withRuleUpdates(state: GameState): GameState {
  const unlockedRuleIds = unlockNextRuleIds(state);
  const riskTags = collectRiskTags({ ...state, unlockedRuleIds });
  return { ...state, unlockedRuleIds, riskTags };
}

function ticketFromNow(now: number): string {
  return `CASE-${String(now % 10_000).padStart(4, "0")}`;
}

function canCompleteCreateAccount(state: GameState): boolean {
  if (state.chapter !== "create") return false;
  return evaluateRules(state).some((rule) => rule.id === "create.complete" && rule.status === "passed");
}

function canFinishRecover(state: GameState): boolean {
  if (state.chapter !== "recover") return false;
  const evaluations = new Map(evaluateRules(state).map((rule) => [rule.id, rule.status]));
  return recoverAccountRules.every((rule) => evaluations.get(rule.id) === "passed");
}

function navigateBrowser(state: GameState, currentUrl: PageId, addressText: string, searchQuery: string): GameState {
  return {
    ...state,
    browser: {
      ...state.browser,
      currentUrl,
      addressText,
      searchQuery,
      isLoading: true,
      history: [...state.browser.history, state.browser.currentUrl],
    },
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "profile/update": {
      const profile = { ...state.profile, [action.field]: action.value };
      const regionChanged =
        state.chapter === "create" &&
        action.field === "region" &&
        state.profile.region !== "" &&
        state.profile.region !== action.value;
      const history = {
        ...state.history,
        regionChangeCount: state.history.regionChangeCount + (regionChanged ? 1 : 0),
      };
      return withRuleUpdates({ ...state, profile, history });
    }

    case "browser/navigate":
      return navigateBrowser(state, action.site, action.site, "");

    case "browser/submitAddress": {
      const value = action.value.trim();
      const resolution = resolveAddressInput(value);
      if (resolution.type === "site") {
        return navigateBrowser(state, resolution.site, resolution.site, "");
      }
      return navigateBrowser(state, "search.local", value, value);
    }

    case "browser/loadComplete":
      return {
        ...state,
        browser: {
          ...state.browser,
          isLoading: false,
        },
      };

    case "browser/back": {
      const previous = state.browser.history.at(-1);
      if (!previous) return state;
      return {
        ...state,
        browser: {
          ...state.browser,
          currentUrl: previous,
          addressText: previous,
          isLoading: true,
          history: state.browser.history.slice(0, -1),
        },
      };
    }

    case "browser/toggleProxy": {
      const proxyEnabled = !state.browser.proxyEnabled;
      const history = {
        ...state.history,
        proxyOnUseCountDuringRegistration:
          state.chapter === "create" && proxyEnabled
            ? state.history.proxyOnUseCountDuringRegistration + 1
            : state.history.proxyOnUseCountDuringRegistration,
      };
      const region: SupportedRegion = proxyEnabled ? "United States" : "China";
      return withRuleUpdates({
        ...state,
        history,
        browser: {
          ...state.browser,
          proxyEnabled,
          isLoading: true,
          timezoneReport: {
            region,
            timezone: REGION_TIMEZONE[region],
            language: "en-US",
          },
        },
      });
    }

    case "sms/refresh":
      return withRuleUpdates({
        ...state,
        browser: {
          ...state.browser,
          currentSmsCode: generateSmsCode(action.seed),
          smsRefreshAt: action.now + 30_000,
        },
      });

    case "identity/generate":
      return withRuleUpdates({
        ...state,
        profile: { ...state.profile, identityCard: action.card },
        history: {
          ...state.history,
          generatedIdentityCards: [...state.history.generatedIdentityCards, action.card],
        },
      });

    case "rules/recheck":
      return withRuleUpdates(state);

    case "game/completeCreateAccount": {
      if (!canCompleteCreateAccount(state)) return withRuleUpdates(state);

      const ticketNumber = ticketFromNow(action.now);
      return {
        ...state,
        chapter: "recover",
        unlockedRuleIds: ["recover.salutation"],
        history: {
          ...state.history,
          registrationSuccessAt: action.now,
          generatedTicketNumber: ticketNumber,
          firstSuccessfulSmsCode: state.history.firstSuccessfulSmsCode ?? state.profile.smsCode,
        },
        profile: {
          ...state.profile,
          ticketNumber,
          appealLetter: "Dear Safeguards Team, ",
        },
        browser: {
          ...state.browser,
          currentUrl: "cloudyai.signup.fake",
          addressText: "cloudyai.signup.fake",
          searchQuery: "",
          isLoading: true,
          mailboxMessages: [
            ...state.browser.mailboxMessages,
            {
              id: `mail-${ticketNumber}`,
              subject: "Account recovery ticket",
              greetingPhrase: "Hello valued user",
              body: `Your account was suspended for ${state.history.suspensionReason}.`,
              ticketNumber,
              createdAt: action.now,
            },
          ],
        },
        systemLog: [...state.systemLog, "Welcome. Your account has been suspended."],
      };
    }

    case "game/finishRecover":
      if (!canFinishRecover(state)) return state;
      return { ...state, ending: chooseEnding(state) };

    default:
      return state;
  }
}
