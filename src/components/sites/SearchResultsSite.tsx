import type { Dispatch } from "react";
import type { GameAction } from "../../game/reducer";
import { searchSites } from "../../game/search";

interface SearchResultsSiteProps {
  query: string;
  dispatch: Dispatch<GameAction>;
}

export function SearchResultsSite({ query, dispatch }: SearchResultsSiteProps) {
  const results = searchSites(query);

  return (
    <div className="search-page">
      <header className="search-header">
        <div className="search-brand">Gloogle</div>
        <div>
          <h1>Search results</h1>
          <p className="search-summary">Results for {query || "nothing in particular"}</p>
        </div>
      </header>

      {results.length > 0 ? (
        <ol className="search-results">
          {results.map((result) => (
            <li key={result.site} className="search-result">
              <div>
                <span className="result-url">{result.url}</span>
                <h2>{result.title}</h2>
                <p>{result.description}</p>
              </div>
              <button
                type="button"
                className="secondary-button"
                aria-label={`Open ${result.title}`}
                onClick={() => dispatch({ type: "browser/navigate", site: result.site })}
              >
                Open
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-search">
          <h2>No results found</h2>
          <p>Try something a bureaucracy would whisper: verification code, phone region, acceptable identity, recovery mailbox, timezone report.</p>
        </div>
      )}
    </div>
  );
}
