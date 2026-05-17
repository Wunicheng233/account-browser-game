interface RecoveryBriefingProps {
  suspensionReason: string;
  onDismiss: () => void;
}

export function RecoveryBriefing({ suspensionReason, onDismiss }: RecoveryBriefingProps) {
  return (
    <div className="intro-backdrop">
      <section className="intro-dialog" role="dialog" aria-modal="true" aria-labelledby="recovery-briefing-title">
        <p className="intro-eyebrow">CloudyAI Account Desk</p>
        <h1 id="recovery-briefing-title">Oh No. Fuck Cloud.</h1>
        <p className="intro-lede">
          I finally got the account open. I blinked. It was already suspended for a reason with the emotional range of a
          parking ticket: {suspensionReason}. Now I am not a new user anymore. I am a case number with a heartbeat.
        </p>
        <div className="intro-grid" aria-label="Recovery rules and tools">
          <section>
            <h2>What Just Happened</h2>
            <p>
              The signup phase is over. The account exists just long enough to become unavailable, which is apparently a
              modern onboarding flow with better lighting.
            </p>
          </section>
          <section>
            <h2>What I Need Now</h2>
            <p>
              I have to write an appeal, mention the official reason exactly once, and prove I am the same person who was
              approved thirty seconds ago.
            </p>
          </section>
          <section>
            <h2>Where Evidence Lives</h2>
            <p>
              The mailbox has the ticket. Other pages still hide small bureaucratic trophies. The address bar remains the
              only clerk willing to answer a question.
            </p>
          </section>
          <section>
            <h2>Proxy Mood</h2>
            <p>
              Proxy ON and Proxy OFF still open different doors. The wrong door will not explain policy, but it may explain
              itself by failing with confidence.
            </p>
          </section>
        </div>
        <button type="button" className="primary-button intro-action" onClick={onDismiss} autoFocus>
          Start the Appeal
        </button>
      </section>
    </div>
  );
}
