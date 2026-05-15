import type { RuleDefinition } from "../types";
import { fail, isEnglishOnly, pass } from "./helpers";

function occurrenceCount(text: string, phrase: string): number {
  if (!phrase) return 0;
  return text.toLowerCase().split(phrase.toLowerCase()).length - 1;
}

function commaCount(text: string): number {
  return [...text].filter((char) => char === ",").length;
}

function identityDigits(identityNumber: string): string[] {
  return [...new Set(identityNumber.replace(/\D/g, "").split(""))].filter(Boolean);
}

export const recoverAccountRules: RuleDefinition[] = [
  {
    id: "recover.salutation",
    chapter: "recover",
    title: "Safeguards salutation",
    description: "Appeal letter must start with Dear Safeguards Team,.",
    check: ({ profile }) =>
      profile.appealLetter.startsWith("Dear Safeguards Team,")
        ? pass("The team has agreed it is a team.")
        : fail("Appeal letter must start with Dear Safeguards Team,."),
  },
  {
    id: "recover.reasonOnce",
    chapter: "recover",
    title: "Reason mention",
    description: "Suspension reason phrase must appear exactly once.",
    unlockAfter: "recover.salutation",
    check: ({ profile, history }) =>
      occurrenceCount(profile.appealLetter, history.suspensionReason) === 1
        ? pass("Reason acknowledged without dwelling.")
        : fail("Suspension reason must appear exactly once.", ["appeal_tone_unclear"]),
  },
  {
    id: "recover.ticketFromMailbox",
    chapter: "recover",
    title: "Ticket number",
    description: "Ticket number must come from the latest recovery email.",
    unlockAfter: "recover.reasonOnce",
    check: ({ profile, browser }) => {
      const latestTicket = [...browser.mailboxMessages].reverse().find((message) => message.ticketNumber)?.ticketNumber;
      return latestTicket && profile.ticketNumber === latestTicket
        ? pass("Ticket number accepted.")
        : fail("Ticket number must match the latest recovery email.");
    },
  },
  {
    id: "recover.ticketNoGreeting",
    chapter: "recover",
    title: "Ticket without greeting",
    description: "Appeal letter must include the ticket number but not include the mailbox greeting phrase.",
    unlockAfter: "recover.ticketFromMailbox",
    check: ({ profile, browser }) => {
      const latest = [...browser.mailboxMessages].reverse().find((message) => message.ticketNumber);
      if (!latest || !latest.ticketNumber) return fail("Open mailbox.local to receive a ticket.");
      const includesTicket = profile.appealLetter.includes(latest.ticketNumber);
      const includesGreeting = profile.appealLetter.includes(latest.greetingPhrase);
      return includesTicket && !includesGreeting
        ? pass("Ticket included without emotional contamination.")
        : fail("Include the ticket number without copying the mailbox greeting.");
    },
  },
  {
    id: "recover.denyMultipleAccounts",
    chapter: "recover",
    title: "Backup identity",
    description: "Appeal letter must deny creating multiple accounts while recovery email remains present.",
    unlockAfter: "recover.ticketNoGreeting",
    check: ({ profile }) =>
      profile.recoveryEmail && /not create multiple accounts/i.test(profile.appealLetter)
        ? pass("Backup identity contradiction accepted.")
        : fail("Deny creating multiple accounts while keeping a recovery email."),
  },
  {
    id: "recover.regionCommas",
    chapter: "recover",
    title: "Comma relocation",
    description: "Appeal letter must contain exactly as many commas as region changes during registration.",
    unlockAfter: "recover.denyMultipleAccounts",
    check: ({ profile, history }) =>
      commaCount(profile.appealLetter) === history.regionChangeCount
        ? pass("Punctuation explains your travel history.")
        : fail(`Appeal letter must contain exactly ${history.regionChangeCount} commas.`, ["region_mismatch"]),
  },
  {
    id: "recover.firstSmsCode",
    chapter: "recover",
    title: "First successful code",
    description: "Appeal letter must include the first successfully used SMS code.",
    unlockAfter: "recover.regionCommas",
    check: ({ profile, history }) =>
      history.firstSuccessfulSmsCode && profile.appealLetter.includes(history.firstSuccessfulSmsCode)
        ? pass("Original verification remembered.")
        : fail("Appeal letter must include the first successful SMS code."),
  },
  {
    id: "recover.noIdentityDigits",
    chapter: "recover",
    title: "No identity digits",
    description: "Appeal letter must not contain any digit from the fictional identity number.",
    unlockAfter: "recover.firstSmsCode",
    check: ({ profile }) => {
      if (!profile.identityCard) return fail("Generate a fictional identity card first.");
      const blockedDigits = identityDigits(profile.identityCard.identityNumber);
      return blockedDigits.some((digit) => profile.appealLetter.includes(digit))
        ? fail("Appeal letter contains a digit from the identity number.", ["identity_loop"])
        : pass("Identity digits safely absent.");
    },
  },
  {
    id: "recover.birthdayMatch",
    chapter: "recover",
    title: "Birthday match",
    description: "Identity card birthday must match account birthday.",
    unlockAfter: "recover.noIdentityDigits",
    check: ({ profile }) =>
      profile.identityCard?.birthday === profile.birthday
        ? pass("Birthday agrees with itself.")
        : fail("Identity card birthday must match account birthday.", ["identity_loop"]),
  },
  {
    id: "recover.tone",
    chapter: "recover",
    title: "Polite but not desperate",
    description: "thank you appears exactly once and exclamation marks are not allowed.",
    unlockAfter: "recover.birthdayMatch",
    check: ({ profile }) => {
      const thankYous = occurrenceCount(profile.appealLetter, "thank you");
      return thankYous === 1 && !profile.appealLetter.includes("!")
        ? pass("Tone is acceptably grateful.")
        : fail("Use thank you exactly once and no exclamation marks.", ["appeal_tone_unclear"]);
    },
  },
  {
    id: "recover.traveling",
    chapter: "recover",
    title: "Travel explanation",
    description: "If Proxy ON was used more than three times during registration, appeal letter must include I was traveling.",
    unlockAfter: "recover.tone",
    check: ({ profile, history }) => {
      if (history.proxyOnUseCountDuringRegistration <= 3) return pass("Travel explanation not required.");
      return profile.appealLetter.includes("I was traveling")
        ? { status: "passed", message: "Travel explanation accepted but marked as unusually convenient.", riskTags: ["vpn_energy"] }
        : fail("Appeal letter must include I was traveling.", ["vpn_energy"]);
    },
  },
  {
    id: "recover.finalPhrase",
    chapter: "recover",
    title: "Final identity phrase",
    description: "Final identity phrase must exactly match email + username + account region + ticket number.",
    unlockAfter: "recover.traveling",
    check: ({ profile }) => {
      const expected = `${profile.email} ${profile.username} ${profile.region} ${profile.ticketNumber}`;
      return profile.finalIdentityPhrase === expected
        ? pass("You are consistent with the latest version of you.")
        : fail("Final identity phrase does not match.");
    },
  },
];
