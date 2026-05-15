import {
  DEFAULT_TABS,
  REGION_TIMEZONE,
  SAVE_VERSION,
  SUSPENSION_REASON,
} from "./constants";
import type { GameState } from "./types";

export function createInitialState(now = Date.now()): GameState {
  return {
    saveVersion: SAVE_VERSION,
    chapter: "create",
    profile: {
      email: "",
      username: "",
      password: "",
      region: "",
      phone: "",
      birthday: "",
      recoveryEmail: "",
      registrationStatement: "",
      appealLetter: "",
      smsCode: "",
      identityCard: null,
      ticketNumber: "",
      finalIdentityPhrase: "",
    },
    browser: {
      currentUrl: "cloudyai.signup.fake",
      history: [],
      proxyEnabled: false,
      openTabs: [...DEFAULT_TABS],
      currentSmsCode: "482739",
      smsRequiredTotal: 33,
      smsRefreshAt: now + 30_000,
      mailboxMessages: [],
      timezoneReport: {
        region: "United States",
        timezone: REGION_TIMEZONE["United States"],
        language: "en-US",
      },
    },
    history: {
      regionChangeCount: 0,
      proxyOnUseCountDuringRegistration: 0,
      smsFailureCount: 0,
      firstSuccessfulSmsCode: null,
      registrationSuccessAt: null,
      suspensionReason: SUSPENSION_REASON,
      firstAppealLetter: null,
      generatedTicketNumber: null,
      generatedIdentityCards: [],
    },
    unlockedRuleIds: ["create.email"],
    riskTags: [],
    systemLog: ["CloudyAI Account Console initialized."],
    ending: null,
  };
}
