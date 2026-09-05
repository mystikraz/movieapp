import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { searchMovies } from "~/lib/api";

import { SearchBar } from "./SearchBar";

vi.mock("~/lib/api", () => ({ searchMovies: vi.fn() }));

const searchMoviesMock = vi.mocked(searchMovies);

describe("SearchBar", () => {
  beforeEach(() => {
    searchMoviesMock.mockReset();
  });

  it("submits a query and displays the matching movies", async () => {
    searchMoviesMock.mockResolvedValue({
      results: [{ id: 1, title: "Alien", overview: null, posterPath: null, backdropPath: null, voteAverage: 8.5, releaseDate: "1979-05-25" }],
      page: 1,
      totalPages: 1,
      totalResults: 1,
    });
    render(<SearchBar />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Search for a movie" }), { target: { value: "Alien" } });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => expect(searchMoviesMock).toHaveBeenCalledWith("Alien", 1, expect.any(AbortSignal)));
    expect(await screen.findByText(/Results for/)).toHaveTextContent("Alien");
    expect(screen.getByText("Alien")).toBeInTheDocument();
  });

  it("shows a distinct empty-results message", async () => {
    searchMoviesMock.mockResolvedValue({ results: [], page: 1, totalPages: 0, totalResults: 0 });
    render(<SearchBar />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Unknown" } });
    fireEvent.submit(screen.getByRole("searchbox").closest("form")!);

    expect(await screen.findByText(/No movies found for/)).toHaveTextContent("Unknown");
  });

  it("loads the next page while preserving the submitted query", async () => {
    searchMoviesMock
      .mockResolvedValueOnce({ results: [], page: 1, totalPages: 2, totalResults: 2 })
      .mockResolvedValueOnce({ results: [], page: 2, totalPages: 2, totalResults: 2 });
    render(<SearchBar />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Dune" } });
    fireEvent.submit(screen.getByRole("searchbox").closest("form")!);
    await screen.findByRole("button", { name: "Go to next search results page" });
    fireEvent.click(screen.getByRole("button", { name: "Go to next search results page" }));

    await waitFor(() => expect(searchMoviesMock).toHaveBeenLastCalledWith("Dune", 2, expect.any(AbortSignal)));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });

  it("shows a safe error message when searching fails", async () => {
    searchMoviesMock.mockRejectedValue(new Error("Internal request details"));
    render(<SearchBar />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Dune" } });
    fireEvent.submit(screen.getByRole("searchbox").closest("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't search for movies right now. Please try again.");
    expect(screen.queryByText("Internal request details")).not.toBeInTheDocument();
  });

  it("clears the submitted search and returns focus to the input", async () => {
    searchMoviesMock.mockResolvedValue({ results: [], page: 1, totalPages: 0, totalResults: 0 });
    render(<SearchBar />);

    const searchbox = screen.getByRole("searchbox");
    fireEvent.change(searchbox, { target: { value: "Dune" } });
    fireEvent.submit(searchbox.closest("form")!);
    await screen.findByText(/No movies found for/);

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(searchbox).toHaveValue("");
    expect(searchbox).toHaveFocus();
    expect(screen.queryByText(/No movies found for/)).not.toBeInTheDocument();
    expect(screen.getByText("Search by title to see matching movies.")).toBeInTheDocument();
  });

  it("shows debounced movie suggestions while typing", async () => {
    searchMoviesMock.mockResolvedValue({
      results: [{ id: 1, title: "Alien", overview: null, posterPath: null, backdropPath: null, voteAverage: 8.5, releaseDate: null }],
      page: 1,
      totalPages: 1,
      totalResults: 1,
    });
    vi.useFakeTimers();
    render(<SearchBar />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Al" } });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(searchMoviesMock).toHaveBeenCalledWith("Al", 1, expect.any(AbortSignal));
    expect(screen.getByRole("listbox", { name: "Movie suggestions" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alien" })).toHaveAttribute("href", "/movies/1");
    vi.useRealTimers();
  });
});
