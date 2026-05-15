import { evaluateRules } from "../../game/ruleEngine";
import type { GameState } from "../../game/types";

interface RulePanelProps {
  state: GameState;
}

export function RulePanel({ state }: RulePanelProps) {
  const rules = evaluateRules(state);

  return (
    <aside className="rule-panel" aria-label="Rules and status">
      <div className="status-strip">
        <span>{state.chapter === "create" ? "Create Account" : "Recover Account"}</span>
        <span>Risk {state.riskTags.length}</span>
      </div>
      <section>
        <h2>Rules</h2>
        <ol className="rule-list">
          {rules.map((rule) => (
            <li key={rule.id} className={`rule-item ${rule.status}`}>
              <strong>{rule.title}</strong>
              <p>{rule.description}</p>
              <small>{rule.message}</small>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2>Risk tags</h2>
        <div className="tag-list">
          {state.riskTags.length === 0 ? <span className="empty">None yet</span> : state.riskTags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </section>
      <section>
        <h2>System log</h2>
        <ul className="system-log">
          {state.systemLog.slice(-6).map((line, index) => (
            <li key={`${line}-${index}`}>{line}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
