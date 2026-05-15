import type { EndingId, GameState } from "./types";

export interface EndingDefinition {
  id: EndingId;
  title: string;
  body: string;
  buttonLabel: string;
}

export const ENDINGS: Record<EndingId, EndingDefinition> = {
  recovered: {
    id: "recovered",
    title: "Recovered",
    body: "Your account has been restored. The welcome page contains one button: Log out.",
    buttonLabel: "Log out",
  },
  read_only_human: {
    id: "read_only_human",
    title: "Read Only Human",
    body: "The system believes you exist, but it does not trust input from you.",
    buttonLabel: "Acknowledge",
  },
  appeal_pending: {
    id: "appeal_pending",
    title: "Appeal Pending",
    body: "Your appeal entered a 90-day queue. The countdown begins at 91.",
    buttonLabel: "Refresh later",
  },
  account_exists_user_does_not: {
    id: "account_exists_user_does_not",
    title: "Account Exists, User Does Not",
    body: "The account is confirmed real. The user remains too risky to exist near it.",
    buttonLabel: "Close",
  },
  thank_you_for_understanding: {
    id: "thank_you_for_understanding",
    title: "Thank You For Understanding",
    body: "The support system closed the case. Every available action says Close.",
    buttonLabel: "Close",
  },
};

export function chooseEnding(state: GameState): EndingId {
  const tags = new Set(state.riskTags);

  if (tags.has("identity_loop") && tags.has("region_mismatch")) {
    return "account_exists_user_does_not";
  }

  if (tags.has("appeal_tone_unclear") && tags.has("too_determined")) {
    return "thank_you_for_understanding";
  }

  if (tags.has("vpn_energy") && tags.has("verification_chaser")) {
    return "appeal_pending";
  }

  if (tags.size > 0) {
    return "read_only_human";
  }

  return "recovered";
}
