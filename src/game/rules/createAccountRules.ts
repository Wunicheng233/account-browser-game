import type { RuleContext, RuleDefinition } from "../types";
import {
  ageFromBirthday,
  createChecks,
  emailDomain,
  fail,
  isEnglishOnly,
  isSupportedRegion,
  isValidEmail,
  pass,
  passwordHasSponsor,
  passwordIsStrong,
  phoneMatchesRegion,
  statementHasForbiddenWord,
  statementHasRomanizedWord,
  timezoneMatchesRegion,
} from "./helpers";
import { scoreUsernameSimilarity } from "../usernameSimilarity";
import { digitSum } from "../sms";

function allPriorUnlockedCreateRulesPass(context: RuleContext): boolean {
  return createAccountRules
    .filter((rule) => rule.id !== "create.complete")
    .filter((rule) => context.unlockedRuleIds.includes(rule.id))
    .every((rule) => rule.check(context).status === "passed");
}

export const createAccountRules: RuleDefinition[] = [
  {
    id: "create.email",
    chapter: "create",
    title: "Valid email",
    description: "Email must be valid.",
    check: ({ profile }) => (isValidEmail(profile.email) ? pass("Email accepted.") : fail("Enter a valid email address.")),
  },
  {
    id: "create.password",
    chapter: "create",
    title: "Strong password",
    description: "Password must be at least 12 characters and include uppercase, number, and symbol.",
    unlockAfter: "create.email",
    check: ({ profile }) =>
      passwordIsStrong(profile.password)
        ? pass("Password has sufficient ambition.")
        : fail("Password is not ambitious enough."),
  },
  {
    id: "create.englishOnly",
    chapter: "create",
    title: "English only",
    description: "All submitted text must be English only.",
    unlockAfter: "create.password",
    check: ({ profile }) => {
      const text = [
        profile.email,
        profile.username,
        profile.password,
        profile.phone,
        profile.recoveryEmail,
        profile.registrationStatement,
      ].join("\n");
      return isEnglishOnly(text) ? pass("Language profile accepted.") : fail("Submitted text must use English only.");
    },
  },
  {
    id: "create.usernameSimilarity",
    chapter: "create",
    title: "Username originality",
    description: "Username must not be taken, and similarity to taken usernames must be below 70%.",
    unlockAfter: "create.englishOnly",
    check: ({ profile }) => {
      if (profile.username.trim() === "") return fail("Username cannot be empty.");
      const similarity = scoreUsernameSimilarity(profile.username);
      return !similarity.blocked
        ? pass("Username is sufficiently unlike known people.")
        : fail(`Too similar to ${similarity.closest}: ${similarity.score}%.`, ["too_determined"]);
    },
  },
  {
    id: "create.age",
    chapter: "create",
    title: "Age check",
    description: "Age must be over 18.",
    unlockAfter: "create.usernameSimilarity",
    check: ({ profile }) =>
      ageFromBirthday(profile.birthday) > 18 ? pass("Age confirmed.") : fail("This service requires an older version of you."),
  },
  {
    id: "create.recoveryEmail",
    chapter: "create",
    title: "Recovery email",
    description: "Recovery email must be valid and use a different domain from the main email.",
    unlockAfter: "create.age",
    check: ({ profile }) =>
      isValidEmail(profile.recoveryEmail) && emailDomain(profile.recoveryEmail) !== emailDomain(profile.email)
        ? pass("Backup identity accepted.")
        : fail("Recovery email must be valid and use a different domain."),
  },
  {
    id: "create.supportedRegion",
    chapter: "create",
    title: "Supported region",
    description: "Account region must be a supported region.",
    unlockAfter: "create.recoveryEmail",
    check: ({ profile }) =>
      isSupportedRegion(profile.region)
        ? pass("Region is supported by the idea of support.")
        : fail("Choose a supported region.", ["region_mismatch"]),
  },
  {
    id: "create.phoneRegion",
    chapter: "create",
    title: "Phone region",
    description: "Phone country code must match the account region. Numbers also need passports now.",
    unlockAfter: "create.supportedRegion",
    check: ({ profile }) =>
      phoneMatchesRegion(profile.phone, profile.region)
        ? pass("Phone region agrees with account region.")
        : fail("The phone number is wearing the wrong little flag. Maybe the browser knows how digits cross borders.", ["region_mismatch"]),
  },
  {
    id: "create.smsMatches",
    chapter: "create",
    title: "Current SMS code",
    description: "SMS code must match the current 6-digit code. Somewhere nearby, a temporary truth is blinking.",
    unlockAfter: "create.phoneRegion",
    check: ({ profile, browser }) =>
      profile.smsCode === browser.currentSmsCode
        ? pass("Verification code accepted for now.")
        : fail("This code belongs to another moment. The search box is sitting right there, pretending not to help.", ["verification_chaser"]),
  },
  {
    id: "create.smsDigitSum",
    chapter: "create",
    title: "SMS digit sum",
    description: "SMS code digits must be at least today's verification target. Check the SMS center.",
    unlockAfter: "create.smsMatches",
    check: (context) => {
      const currentSum = digitSum(context.profile.smsCode);
      const target = context.browser.smsRequiredTotal;
      return createChecks.smsDigitSum(context)
        ? pass("Digits add up to compliance.")
        : fail(`Current sum: ${currentSum}, target: ${target}. Keep calculating.`);
    },
  },
  {
    id: "create.usernameSmsPair",
    chapter: "create",
    title: "Username code trace",
    description: "Username must include any two consecutive digits from the current SMS code.",
    unlockAfter: "create.smsDigitSum",
    check: (context) =>
      createChecks.usernameHasSmsPair(context)
        ? pass("Username contains a recent enough trace.")
        : fail("Username must include two consecutive digits from the current SMS code."),
  },
  {
    id: "create.sponsorPassword",
    chapter: "create",
    title: "Sponsor password",
    description: "Password must include one sponsor name.",
    unlockAfter: "create.usernameSmsPair",
    check: ({ profile }) =>
      passwordHasSponsor(profile.password)
        ? pass("Sponsor relationship acknowledged.")
        : fail("Password must include Gloogle, CloudyAI, or PearHub."),
  },
  {
    id: "create.statementLength",
    chapter: "create",
    title: "Statement length",
    description: "Registration statement must be 80-140 characters.",
    unlockAfter: "create.sponsorPassword",
    check: ({ profile }) =>
      profile.registrationStatement.length >= 80 && profile.registrationStatement.length <= 140
        ? pass("Statement length is emotionally moderate.")
        : fail("Statement must be between 80 and 140 characters."),
  },
  {
    id: "create.ordinaryUser",
    chapter: "create",
    title: "Ordinary user",
    description: "Registration statement must include ordinary user.",
    unlockAfter: "create.statementLength",
    check: ({ profile }) =>
      profile.registrationStatement.toLowerCase().includes("ordinary user")
        ? pass("Ordinariness detected.")
        : fail("Statement must include ordinary user."),
  },
  {
    id: "create.statementForbiddenWords",
    chapter: "create",
    title: "Neutral language",
    description: "Registration statement must not include need, urgent, VPN, proxy, or mainland.",
    unlockAfter: "create.ordinaryUser",
    check: ({ profile }) =>
      !statementHasForbiddenWord(profile.registrationStatement)
        ? pass("No dangerous eagerness detected.")
        : fail("Statement contains a flagged word.", ["too_determined"]),
  },
  {
    id: "create.romanizedNeutrality",
    chapter: "create",
    title: "Romanized neutrality",
    description: "Registration statement must include one approved romanized neutrality word.",
    unlockAfter: "create.statementForbiddenWords",
    check: ({ profile }) =>
      statementHasRomanizedWord(profile.registrationStatement)
        ? pass("Cultural neutrality token accepted.")
        : fail("Statement must include nihao, xiexie, or meiyou."),
  },
  {
    id: "create.timezone",
    chapter: "create",
    title: "Timezone match",
    description: "Timezone report must match the account region. Time, famously, is a compliance document now.",
    unlockAfter: "create.romanizedNeutrality",
    check: (context) =>
      timezoneMatchesRegion(context)
        ? pass("Time agrees with geography.")
        : fail("Your clock and your country are telling different stories. A neutral-looking website may adjudicate time.", ["region_mismatch"]),
  },
  {
    id: "create.identityGenerated",
    chapter: "create",
    title: "Identity card",
    description: "A fictional identity card must exist. Official-looking fiction is still fiction, allegedly.",
    unlockAfter: "create.timezone",
    check: ({ profile }) =>
      profile.identityCard
        ? pass("Identity artifact generated.")
        : fail("No acceptable identity artifact yet. Perhaps a serious little department is waiting behind a search result."),
  },
  {
    id: "create.identityRegion",
    chapter: "create",
    title: "Identity region",
    description: "Identity card region must match the account region.",
    unlockAfter: "create.identityGenerated",
    check: ({ profile }) =>
      profile.identityCard && profile.identityCard.region === profile.region
        ? pass("Identity region matches account region.")
        : fail("Identity card region does not match account region.", ["identity_loop"]),
  },
  {
    id: "create.complete",
    chapter: "create",
    title: "Create account",
    description: "All unlocked Create Account rules must pass.",
    unlockAfter: "create.identityRegion",
    check: (context) =>
      allPriorUnlockedCreateRulesPass(context)
        ? pass("Account created. Account suspended.")
        : fail("All unlocked Create Account rules must pass before creation."),
  },
];
