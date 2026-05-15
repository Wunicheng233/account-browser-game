import { ENDINGS } from "../../game/endings";
import type { EndingId } from "../../game/types";

interface EndingViewProps {
  endingId: EndingId;
}

export function EndingView({ endingId }: EndingViewProps) {
  const ending = ENDINGS[endingId];

  return (
    <main className="ending-screen">
      <section className="site-card">
        <h1>{ending.title}</h1>
        <p>{ending.body}</p>
        <button type="button" className="primary-button">
          {ending.buttonLabel}
        </button>
      </section>
    </main>
  );
}
