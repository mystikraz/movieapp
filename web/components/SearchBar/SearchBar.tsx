"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Fire } from "@phosphor-icons/react/dist/csr/Fire";
import { FilmSlate } from "@phosphor-icons/react/dist/csr/FilmSlate";
import { MagnifyingGlass, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { SpinnerGap, SpinnerGapIcon } from "@phosphor-icons/react/dist/csr/SpinnerGap";
import { X } from "@phosphor-icons/react/dist/csr/X";

import {
  getTrendingMovies,
  searchMovies,
  type MovieSearchResponse,
} from "~/lib/api";
import { TrendingGrid } from "~/components/TrendingGrid";
import type { Movie } from "~/types/movie";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchResult, setSearchResult] = useState<MovieSearchResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const abortController = useRef<AbortController | null>(null);
  const suggestionAbortController = useRef<AbortController | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const suggestionLinks = useRef<Array<HTMLAnchorElement | null>>([]);
  const requestId = useRef(0);
  const suggestionRequestId = useRef(0);
  const trendingLoaded = useRef(false);
  const trendingLoading = useRef(false);

  useEffect(
    () => () => {
      abortController.current?.abort();
      suggestionAbortController.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const suggestionQuery = query.trim();

    if (suggestionQuery.length < 2 || suggestionQuery === submittedQuery) {
      setSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    const controller = new AbortController();
    suggestionAbortController.current?.abort();
    suggestionAbortController.current = controller;
    const currentRequestId = ++suggestionRequestId.current;

    const timeoutId = window.setTimeout(() => {
      setIsSuggesting(true);
      void searchMovies(suggestionQuery, 1, controller.signal)
        .then((result) => {
          if (suggestionRequestId.current === currentRequestId) {
            setSuggestions(result.results.slice(0, 5));
          }
        })
        .catch(() => {
          if (
            !controller.signal.aborted &&
            suggestionRequestId.current === currentRequestId
          ) {
            setSuggestions([]);
          }
        })
        .finally(() => {
          if (suggestionRequestId.current === currentRequestId) {
            setIsSuggesting(false);
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, submittedQuery]);

  const dropdownMovies = query.trim() ? suggestions : trendingMovies;
  const dropdownLabel = query.trim() ? "Movie suggestions" : "Trending now";
  const showDropdown =
    isInputFocused &&
    (dropdownMovies.length > 0 || isTrendingLoading || trendingError);

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

  function dismissSuggestions() {
    suggestionAbortController.current?.abort();
    ++suggestionRequestId.current;
    setSuggestions([]);
    setIsSuggesting(false);
  }

  async function loadTrendingMovies() {
    if (trendingLoaded.current || trendingLoading.current) {
      return;
    }

    trendingLoading.current = true;
    setIsTrendingLoading(true);
    setTrendingError(false);

    try {
      const movies = await getTrendingMovies();
      trendingLoaded.current = true;
      setTrendingMovies(movies.slice(0, 10));
    } catch {
      setTrendingError(true);
    } finally {
      trendingLoading.current = false;
      setIsTrendingLoading(false);
    }
  }

  function handleInputFocus() {
    setIsInputFocused(true);
    if (!query.trim()) {
      void loadTrendingMovies();
    }
  }

  function handleSearchInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "ArrowDown" && dropdownMovies.length > 0) {
      event.preventDefault();
      suggestionLinks.current[0]?.focus();
    }

    if (event.key === "Escape") {
      dismissSuggestions();
    }
  }

  function handleSuggestionKeyDown(
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) {
    if (event.key === "ArrowDown" && index < dropdownMovies.length - 1) {
      event.preventDefault();
      suggestionLinks.current[index + 1]?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index === 0) {
        searchInput.current?.focus();
      } else {
        suggestionLinks.current[index - 1]?.focus();
      }
    }

    if (event.key === "Escape") {
      dismissSuggestions();
      searchInput.current?.focus();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    setHasSubmitted(true);
    dismissSuggestions();

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
    dismissSuggestions();
    setQuery("");
    setSubmittedQuery("");
    setSearchResult(null);
    setError(null);
    setHasSubmitted(false);
    searchInput.current?.focus();
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
      >
        <div
          className="relative w-full"
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              setIsInputFocused(false);
            }
          }}
        >
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
            onFocus={handleInputFocus}
            onKeyDown={handleSearchInputKeyDown}
            placeholder="Search by title, actor, or director"
            aria-controls="movie-search-suggestions"
            aria-expanded={showDropdown}
            aria-busy={isSuggesting || isTrendingLoading}
            className="w-full rounded-lg border border-border bg-surface py-3 pr-4 pl-10 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors duration-200 placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 focus:outline-none"
          />
          <MagnifyingGlass
            aria-hidden="true"
            size={18}
            weight="regular"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          />
          {showDropdown &&
            (dropdownMovies.length > 0 ? (
              <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-xl shadow-black/20">
                {!query.trim() && (
                  <p className="flex items-center gap-2 border-b border-border px-3 py-2.5 text-xs font-medium tracking-wide text-muted uppercase">
                    <Fire
                      aria-hidden="true"
                      size={16}
                      weight="fill"
                      className="text-brand-400"
                    />
                    Trending now
                  </p>
                )}
                <ul
                  id="movie-search-suggestions"
                  role="listbox"
                  aria-label={dropdownLabel}
                >
                  {dropdownMovies.map((movie, index) => (
                    <li key={movie.id} role="option" aria-selected="false">
                      <Link
                        id={`movie-suggestion-${movie.id}`}
                        href={`/movies/${movie.id}`}
                        ref={(element) => {
                          suggestionLinks.current[index] = element;
                        }}
                        onKeyDown={(event) =>
                          handleSuggestionKeyDown(event, index)
                        }
                        className="group flex items-center gap-3 px-3 py-3 text-sm text-foreground transition-colors duration-150 hover:bg-surface-hover focus:bg-surface-hover focus:ring-2 focus:ring-brand-400 focus:outline-none focus:ring-inset"
                      >
                        <FilmSlate
                          aria-hidden="true"
                          size={17}
                          weight={query.trim() ? "regular" : "fill"}
                          className={
                            query.trim()
                              ? "text-muted transition-colors group-hover:text-brand-400"
                              : "text-brand-400"
                          }
                        />
                        <span className="truncate">{movie.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p
                role="status"
                className="absolute z-10 mt-1 w-full rounded-md border border-border bg-surface p-3 text-sm text-muted shadow-lg"
              >
                {isTrendingLoading
                  ? "Loading trending movies…"
                  : "Trending movies are unavailable right now."}
              </p>
            ))}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-brand-500 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background focus:outline-none active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <SpinnerGapIcon
              aria-hidden="true"
              size={18}
              weight="bold"
              className="animate-spin"
            />
          ) : (
            <MagnifyingGlassIcon aria-hidden="true" size={18} weight="bold" />
          )}
          
        </button>
        {(query || hasSubmitted) && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-surface-hover focus:ring-2 focus:ring-brand-400 focus:outline-none active:translate-y-px"
          >
            <X aria-hidden="true" size={17} weight="bold" />
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
          <p className="text-sm text-muted">
            Search by title to see matching movies.
          </p>
        )}
      </div>

      {searchResult && !isLoading && (
        <section className="flex flex-col gap-4" aria-label="Search results">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-medium text-foreground">
              Results for “{submittedQuery}”
            </h2>
            <p className="text-sm text-muted">
              {searchResult.totalResults} result
              {searchResult.totalResults === 1 ? "" : "s"}
            </p>
          </div>

          {searchResult.results.length === 0 ? (
            <p className="text-sm text-muted">
              No movies found for “{submittedQuery}”.
            </p>
          ) : (
            <TrendingGrid movies={searchResult.results} />
          )}

          {searchResult.totalPages > 1 && (
            <nav
              aria-label="Search result pages"
              className="flex items-center gap-3"
            >
              <button
                type="button"
                onClick={() =>
                  void loadPage(submittedQuery, searchResult.page - 1)
                }
                disabled={searchResult.page <= 1}
                aria-label="Go to previous search results page"
                className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-surface-hover focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted" aria-current="page">
                Page {searchResult.page} of {searchResult.totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  void loadPage(submittedQuery, searchResult.page + 1)
                }
                disabled={searchResult.page >= searchResult.totalPages}
                aria-label="Go to next search results page"
                className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-surface-hover focus:ring-2 focus:ring-brand-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
