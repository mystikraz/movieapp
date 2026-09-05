import { MovieCard } from "~/components/MovieCard";
import type { Movie } from "~/types/movie";

export interface TrendingGridProps {
  movies: Movie[];
}

export function TrendingGrid({ movies }: TrendingGridProps) {
  if (movies.length === 0) {
    return <p className="text-sm text-muted">No trending movies right now.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
