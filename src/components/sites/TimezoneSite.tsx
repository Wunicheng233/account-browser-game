import type { GameState } from "../../game/types";

interface TimezoneSiteProps {
  state: GameState;
}

export function TimezoneSite({ state }: TimezoneSiteProps) {
  const report = state.browser.timezoneReport;

  return (
    <div className="site-card">
      <h1>Timezone Checker</h1>
      <p>Your browser has filed the following personality report.</p>
      <dl>
        <dt>Network region</dt>
        <dd>{report.region}</dd>
        <dt>Timezone</dt>
        <dd>{report.timezone}</dd>
        <dt>Browser language</dt>
        <dd>{report.language}</dd>
      </dl>
    </div>
  );
}
