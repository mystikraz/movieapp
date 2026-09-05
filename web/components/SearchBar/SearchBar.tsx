"use client";

import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");

  // TODO(candidate): wire this up to lib/api.ts's searchMovies() and render results
  // (with pagination) instead of just logging. See lib/api.ts and app/page.tsx.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("TODO: search for", query);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <label htmlFor="movie-search" className="sr-only">
        Search for a movie
      </label>
      <input
        id="movie-search"
        type="search"
        name="query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for a movie…"
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
      >
        Search
      </button>
    </form>
  );
}
