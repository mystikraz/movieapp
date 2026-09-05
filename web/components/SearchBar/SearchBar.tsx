"use client";

import { useEffect, useRef, useState } from "react";

import { searchMovies, type MovieSearchResponse } from "~/lib/api";
import { TrendingGrid } from "~/components/TrendingGrid";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchResult, setSearchResult] = useState<MovieSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const abortController = useRef<AbortController | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  useEffect(() => () => abortController.current?.abort(), []);

  async function loadPage(searchQuery: string, page: number) {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;
    const currentRequestId = ++requestId.current;

    setIsLoading(true);
    setError(null);

    try {
      const result = await searchMovies(searchQuery, page, controller.signal);
      if (requestId.current === currentRequestId) {
        setSearchResult(result);
      }
    } catch {
      if (controller.signal.aborted || requestId.current !== currentRequestId) {
        return;
      }

      setSearchResult(null);
      setError("We couldn't search for movies right now. Please try again.");
    } finally {
      if (requestId.current === currentRequestId) {
        setIsLoading(false);
      }
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    setHasSubmitted(true);

    if (!trimmedQuery) {
      abortController.current?.abort();
      setSubmittedQuery("");
      setSearchResult(null);
      setError("Enter a movie title to search.");
      return;
    }

    setSubmittedQuery(trimmedQuery);
    void loadPage(trimmedQuery, 1);
  }

  function handleClear() {
    abortController.current?.abort();
    setQuery("");
    setSubmittedQuery("");
    setSearchResult(null);
    setError(null);
    setHasSubmitted(false);
    searchInput.current?.focus();
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
        <label htmlFor="movie-search" className="sr-only">
          Search for a movie
        </label>
        <input
          id="movie-search"
          type="search"
          name="query"
          ref={searchInput}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a movie…"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
        >
          Search
        </button>
        {(query || hasSubmitted) && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            Clear
          </button>
        )}
      </form>

      <div aria-live="polite" aria-atomic="true">
        {isLoading && <p className="text-sm text-muted">Searching movies…</p>}
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        {!hasSubmitted && !isLoading && !error && (
          <p className="text-sm text-muted">Search by title to see matching movies.</p>
        )}
      </div>

      {searchResult && !isLoading && (
        <section className="flex flex-col gap-4" aria-label="Search results">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-medium text-foreground">
              Results for “{submittedQuery}”
            </h2>
            <p className="text-sm text-muted">
              {searchResult.totalResults} result{searchResult.totalResults === 1 ? "" : "s"}
            </p>
          </div>

          {searchResult.results.length === 0 ? (
            <p className="text-sm text-muted">No movies found for “{submittedQuery}”.</p>
          ) : (
            <TrendingGrid movies={searchResult.results} />
          )}

          {searchResult.totalPages > 1 && (
            <nav aria-label="Search result pages" className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void loadPage(submittedQuery, searchResult.page - 1)}
                disabled={searchResult.page <= 1}
                aria-label="Go to previous search results page"
                className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                Previous
              </button>
              <span className="text-sm text-muted" aria-current="page">
                Page {searchResult.page} of {searchResult.totalPages}
              </span>
              <button
                type="button"
                onClick={() => void loadPage(submittedQuery, searchResult.page + 1)}
                disabled={searchResult.page >= searchResult.totalPages}
                aria-label="Go to next search results page"
                className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                Next
              </button>
            </nav>
          )}
        </section>
      )}
    </div>
  );
}
