export type Chapter = "create" | "recover";

export type SiteId =
  | "cloudyai.signup.fake"
  | "sms.local"
  | "identity.gov.fake"
  | "mailbox.local"
  | "timezone-checker.net";

export type PageId = SiteId | "search.local";

export type SupportedRegion = "United States" | "Canada" | "United Kingdom" | "Australia" | "Taiwan";

export type RiskTag =
  | "region_mismatch"
  | "vpn_energy"
  | "too_determined"
  | "identity_loop"
  | "verification_chaser"
  | "appeal_tone_unclear";

export type RuleStatus = "locked" | "passed" | "failed";

export interface IdentityCard {
  name: string;
  birthday: string;
  region: SupportedRegion;
  identityNumber: string;
}

export interface MailboxMessage {
  id: string;
  subject: string;
  greetingPhrase: string;
  body: string;
  ticketNumber?: string;
  createdAt: number;
}

export interface TimezoneReport {
  region: SupportedRegion;
  timezone: string;
  language: string;
}

export interface Profile {
  email: string;
  username: string;
  password: string;
  region: SupportedRegion | "";
  phone: string;
  birthday: string;
  recoveryEmail: string;
  registrationStatement: string;
  appealLetter: string;
  smsCode: string;
  identityCard: IdentityCard | null;
  ticketNumber: string;
  finalIdentityPhrase: string;
}

export interface BrowserState {
  currentUrl: PageId;
  addressText: string;
  history: PageId[];
  proxyEnabled: boolean;
  openTabs: SiteId[];
  searchQuery: string;
  isLoading: boolean;
  currentSmsCode: string;
  smsRequiredTotal: number;
  smsRefreshAt: number;
  mailboxMessages: MailboxMessage[];
  timezoneReport: TimezoneReport;
}

export interface GameHistory {
  regionChangeCount: number;
  proxyOnUseCountDuringRegistration: number;
  smsFailureCount: number;
  firstSuccessfulSmsCode: string | null;
  registrationSuccessAt: number | null;
  suspensionReason: string;
  firstAppealLetter: string | null;
  generatedTicketNumber: string | null;
  generatedIdentityCards: IdentityCard[];
}

export interface RuleContext {
  profile: Profile;
  browser: BrowserState;
  history: GameHistory;
  chapter: Chapter;
  unlockedRuleIds: string[];
  riskTags: RiskTag[];
}

export interface RuleResult {
  status: Exclude<RuleStatus, "locked">;
  message: string;
  riskTags?: RiskTag[];
}

export interface RuleDefinition {
  id: string;
  chapter: Chapter;
  title: string;
  description: string;
  unlockAfter?: string;
  check: (context: RuleContext) => RuleResult;
}

export interface RuleEvaluation {
  id: string;
  title: string;
  description: string;
  status: RuleStatus;
  message: string;
  riskTags: RiskTag[];
}

export type EndingId =
  | "recovered"
  | "read_only_human"
  | "appeal_pending"
  | "account_exists_user_does_not"
  | "thank_you_for_understanding";

export interface GameState {
  saveVersion: number;
  chapter: Chapter;
  profile: Profile;
  browser: BrowserState;
  history: GameHistory;
  unlockedRuleIds: string[];
  riskTags: RiskTag[];
  systemLog: string[];
  ending: EndingId | null;
}
