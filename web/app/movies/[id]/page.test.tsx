import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMovieDetails } from "~/lib/api";

import MovieDetailsPage from "./page";

vi.mock("~/lib/api", () => ({ getMovieDetails: vi.fn() }));

const getMovieDetailsMock = vi.mocked(getMovieDetails);

describe("MovieDetailsPage", () => {
  beforeEach(() => {
    getMovieDetailsMock.mockReset();
  });

  it("renders movie details and its trailer", async () => {
    getMovieDetailsMock.mockResolvedValue({
      movie: {
        id: 42,
        title: "The Answer",
        overview: "Everything you need to know.",
        posterPath: null,
        backdropPath: null,
        voteAverage: 9.2,
        releaseDate: "2024-05-01",
      },
      trailerKey: "trailer-key",
    });

    render(await MovieDetailsPage({ params: Promise.resolve({ id: "42" }) }));

    expect(getMovieDetailsMock).toHaveBeenCalledWith(42);
    expect(screen.getByRole("heading", { name: "The Answer" })).toBeInTheDocument();
    expect(screen.getByTitle("The Answer trailer")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/trailer-key",
    );
  });

  it("renders a clear fallback when no trailer is available", async () => {
    getMovieDetailsMock.mockResolvedValue({
      movie: {
        id: 42,
        title: "The Answer",
        overview: null,
        posterPath: null,
        backdropPath: null,
        voteAverage: 9.2,
        releaseDate: null,
      },
      trailerKey: null,
    });

    render(await MovieDetailsPage({ params: Promise.resolve({ id: "42" }) }));

    expect(screen.getByText("A trailer is not available for this movie.")).toBeInTheDocument();
    expect(screen.getByText("No overview is available for this movie.")).toBeInTheDocument();
  });
});
