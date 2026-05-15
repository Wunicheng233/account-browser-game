import { allRules } from "./rules";
import type { GameState, RuleContext, RuleEvaluation } from "./types";

export function toRuleContext(state: GameState): RuleContext {
  return {
    profile: state.profile,
    browser: state.browser,
    history: state.history,
    chapter: state.chapter,
    unlockedRuleIds: state.unlockedRuleIds,
    riskTags: state.riskTags,
  };
}

export function evaluateRules(state: GameState): RuleEvaluation[] {
  const context = toRuleContext(state);
  return allRules.map((rule) => {
    if (!state.unlockedRuleIds.includes(rule.id)) {
      return {
        id: rule.id,
        title: rule.title,
        description: rule.description,
        status: "locked",
        message: "Locked.",
        riskTags: [],
      };
    }

    const result = rule.check(context);
    return {
      id: rule.id,
      title: rule.title,
      description: rule.description,
      status: result.status,
      message: result.message,
      riskTags: result.riskTags ?? [],
    };
  });
}

export function unlockNextRuleIds(state: GameState): string[] {
  const evaluations = evaluateRules(state);
  const passed = new Set(evaluations.filter((rule) => rule.status === "passed").map((rule) => rule.id));
  const unlocked = new Set(state.unlockedRuleIds);

  for (const rule of allRules) {
    if (rule.chapter !== state.chapter) continue;
    if (!rule.unlockAfter) continue;
    if (passed.has(rule.unlockAfter)) unlocked.add(rule.id);
  }

  return [...unlocked];
}

export function collectRiskTags(state: GameState): GameState["riskTags"] {
  const tags = new Set(state.riskTags);
  for (const result of evaluateRules(state)) {
    for (const tag of result.riskTags) tags.add(tag);
  }
  return [...tags];
}
