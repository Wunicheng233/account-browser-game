import type { GameState } from "../../game/types";

interface MailboxSiteProps {
  state: GameState;
}

export function MailboxSite({ state }: MailboxSiteProps) {
  return (
    <div className="site-card">
      <h1>Mailbox Local</h1>
      {state.browser.mailboxMessages.length === 0 ? (
        <p>No messages. The system has not needed to misunderstand you yet.</p>
      ) : (
        <ul className="mail-list">
          {state.browser.mailboxMessages.map((message) => (
            <li key={message.id}>
              <strong>{message.subject}</strong>
              <p>{message.greetingPhrase}</p>
              <p>{message.body}</p>
              {message.ticketNumber ? <code>{message.ticketNumber}</code> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
