import { evaluateRules } from "../../game/ruleEngine";
import type { GameState } from "../../game/types";

interface RulePanelProps {
  state: GameState;
}

export function RulePanel({ state }: RulePanelProps) {
  const rules = evaluateRules(state);
  const passedCount = rules.filter((rule) => rule.status === "passed").length;
  const visibleRules = rules.filter((rule) => rule.status !== "locked");

  return (
    <aside className="rule-panel" aria-label="Rules and status">
      <div className="status-strip">
        <span className="status-title">{state.chapter === "create" ? "Create Account" : "Recover Account"}</span>
        <span className="status-risk">Risk {state.riskTags.length}</span>
      </div>
      <section className="panel-section">
        <div className="panel-section-title">
          <h2>Rules</h2>
          <span>{passedCount}/{rules.length}</span>
        </div>
        <ol className="rule-list">
          {visibleRules.map((rule) => (
            <li key={rule.id} className={`rule-item ${rule.status}`}>
              <div className="rule-heading">
                <strong>{rule.title}</strong>
                <span className={`rule-status ${rule.status}`}>{rule.status}</span>
              </div>
              <p>{rule.description}</p>
              <small>{rule.message}</small>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
