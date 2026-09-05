# DEPT Full-Stack Coding Challenge — Movie Search

Great to see your interest in joining DEPT! This challenge is built on the same
conventions we use in real DEPT projects — a .NET API and a Next.js frontend —
so it should feel like picking up an existing codebase rather than starting
from a blank page.

## The challenge

This is a small movie search app powered by [The Movie Database
(TMDB)](https://www.themoviedb.org/). The base setup already works: it shows
this week's trending movies, fetched live from TMDB through our own .NET API.

What's missing is **search**. There's a search box in the UI, but it doesn't
do anything yet, and there's no search endpoint on the API. Your job is to
build that, following the patterns already used in the codebase — and then,
if you have time left, pick up whatever from the list below adds the most
value.

### Time-box

**Up to 4 hours.** We don't expect a fully polished product — we're more
interested in how you approach an existing codebase, what you choose to
prioritize under a real time constraint, and the reasoning behind your
decisions. A well-reasoned partial solution beats a rushed complete one — a
short note in your PR on what you skipped and why is worth as much as code.

### What to build, in priority order

**P0 — the core task (do this first, always evaluated):**

1. **API**: a `GET /api/v1/movies/search?query=&page=` endpoint that proxies
   TMDB's `/search/movie` endpoint. Follow the same pattern used for the
   existing trending endpoint (`api/src/MovieSearchCase.WebApi/Controllers/V1/MoviesController.cs`
   → `Handlers/Movies/` → `Infrastructure/Clients/TmdbClient.cs`). Every
   relevant file has a `TODO(candidate)` comment marking where to start.
2. **Pagination (API)**: TMDB's search response already includes page/total
   pages/total results — decide how to shape that into your own response.
3. **Frontend**: wire the search box (`web/components/SearchBar/`) to your new
   endpoint and render the results, following the existing `MovieCard` /
   `TrendingGrid` components and the fetch pattern in `web/lib/api.ts`.
4. **Pagination (Frontend)**: add pagination UI (next/prev, page numbers,
   infinite scroll — your call) driven by the API's pagination data.

**P1 — expected once P0 works:**

- **Loading, empty, and error states** for search, the same way the trending
  section already handles them (see `web/app/loading.tsx` and
  `web/app/error.tsx`). The grading API can be slow or fail — plan for it.
- **Accessibility**: keyboard and screen-reader usable, same bar as the rest
  of the app (form controls need labels, focus states need to be visible,
  etc).

**P2 — pick up if you have time, biggest single addition:**

- A **movie detail page** (`/movies/[id]` or similar) with more info and a
  **trailer**, embedded from YouTube. TMDB exposes trailer video keys via
  [`GET /movie/{id}/videos`](https://developer.themoviedb.org/reference/movie-videos)
  — no extra API key needed, the same TMDB token covers it.

**P3 — stretch, only if everything above is solid:**

- TV/series search alongside movies (TMDB has a parallel `/tv` namespace —
  we deliberately scoped the base app to movies only).
- Caching or performance work on search (debouncing, revalidation, etc).
- Anything else you think adds real value — surprise us.

### General guidelines

- Reuse what's there: existing components, the Tailwind setup, the
  handler/factory pattern on the API, the mapper conventions. Don't
  restructure the project or introduce a new state-management/styling
  approach — the point is working _within_ existing conventions.
- No database, no auth, no deployment — out of scope.
- Come prepared to briefly explain your rendering strategy (what's
  server-rendered vs client-rendered, and why) — we may ask about it.

### Using AI

AI tools are a normal part of the job here — use them if that's how you work.
We're evaluating how you build and reason about the solution, so please make
sure your submission reflects your own judgment and understanding, not just
generated output you haven't reviewed.

## Getting started

You'll need both the API and the frontend running at the same time.

### 1. Get a free TMDB API key

Sign up at <https://www.themoviedb.org/signup>, then generate an **API Read
Access Token (v4 auth)** at <https://developer.themoviedb.org/docs/getting-started>.
It's free and takes a couple of minutes.

### 2. Run the API

Requires the [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).

```bash
cd api
cp src/MovieSearchCase.WebApi/appsettings.Development.example.json \
   src/MovieSearchCase.WebApi/appsettings.Development.local.json
# edit appsettings.Development.local.json and paste in your TMDB access token
dotnet run --project src/MovieSearchCase.WebApi
```

The API runs at `http://localhost:5080` (Swagger UI at `/swagger`).

### 3. Run the frontend

Requires Node 22+ and [pnpm](https://pnpm.io/installation).

```bash
cd web
cp .env.example .env.local   # defaults already point at the local API
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

### Verify the base setup works

Open `http://localhost:3000` — you should see this week's trending movies.
If you do, you're ready to start on the search feature. If not, check that
both the API and frontend are running and that your TMDB token is correct.

## Repo layout

```
api/   .NET 10 API (Domain / Infrastructure / Shared / WebApi, layered)
web/   Next.js 16 frontend (App Router, Tailwind CSS)
```

Each has its own tests and linting — `dotnet test` in `api/`, `pnpm lint &&
pnpm typecheck && pnpm test` in `web/`. Both run in CI on every PR.

## Submitting

Submit your case in a repository like GitHub and share a link to it with us.
Include a short note on:

- What you prioritized and what you skipped, and why.
- Your rendering strategy for anything new you built (server vs client
  rendering) and the reasoning behind it.

Questions? Reach out to your DEPT contact. Good luck!
