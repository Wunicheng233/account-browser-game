interface StoryIntroProps {
  onDismiss: () => void;
}

export function StoryIntro({ onDismiss }: StoryIntroProps) {
  return (
    <div className="intro-backdrop">
      <section className="intro-dialog" role="dialog" aria-modal="true" aria-labelledby="story-intro-title">
        <p className="intro-eyebrow">CloudyAI Account Desk</p>
        <h1 id="story-intro-title">Welcome to CloudyAI</h1>
        <p className="intro-lede">
          This is an account browser with more procedure than the products it imitates. You only want to create an account.
          The system will inspect you like a safety clerk with a clipboard, one requirement at a time, until it finally approves you,
          then immediately suspects you.
        </p>
        <div className="intro-grid" aria-label="Rules and tools">
          <section>
            <h2>How This Game Works</h2>
            <p>
              Register first, then enjoy the realism of an account that gets suspended right after it wakes up. Fill forms, chase evidence,
              and negotiate with requirements that keep arguing with themselves.
            </p>
          </section>
          <section>
            <h2>What Rules Are</h2>
            <p>
              Pass one rule to reveal the next. Every rule is a real requirement, and every requirement has the private sense of humor
              of an automated safety team.
            </p>
          </section>
          <section>
            <h2>Address Bar</h2>
            <p>
              This is a real-ish browser. Type a URL or search for clues. Verification codes, phone prefixes, identity paperwork,
              mailbox tickets, and timezone reports may all be hiding on web pages.
            </p>
          </section>
          <section>
            <h2>Proxy</h2>
            <p>
              Some sites only listen when Proxy is ON. Some local services shut the door when they see it. Error pages are usually
              more honest than support articles.
            </p>
          </section>
        </div>
        <button type="button" className="primary-button intro-action" onClick={onDismiss} autoFocus>
          I Am Ready
        </button>
      </section>
    </div>
  );
}
