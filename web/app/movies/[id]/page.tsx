import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMovieDetails } from "~/lib/api";

export const dynamic = "force-dynamic";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isInteger(movieId) || movieId < 1) {
    notFound();
  }

  const { movie, trailerKey } = await getMovieDetails(movieId);
  const year = movie.releaseDate?.slice(0, 4);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <Link
        href="/"
        className="w-fit text-sm text-brand-400 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-400"
      >
        Back to movies
      </Link>

      <article className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
          {movie.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              fill
              sizes="(min-width: 768px) 16rem, 80vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">No poster available</div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <header>
            <h1 className="text-3xl font-semibold text-foreground">{movie.title}</h1>
            <p className="mt-2 text-sm text-muted">
              {year && <span>{year} · </span>}
              <span aria-label={`Rated ${movie.voteAverage.toFixed(1)} out of 10`}>
                ★ {movie.voteAverage.toFixed(1)} / 10
              </span>
            </p>
          </header>
          {movie.overview ? (
            <p className="leading-7 text-foreground">{movie.overview}</p>
          ) : (
            <p className="text-muted">No overview is available for this movie.</p>
          )}
        </div>
      </article>

      <section className="flex flex-col gap-3" aria-labelledby="trailer-heading">
        <h2 id="trailer-heading" className="text-xl font-medium text-foreground">Trailer</h2>
        {trailerKey ? (
          <iframe
            title={`${movie.title} trailer`}
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailerKey)}`}
            className="aspect-video w-full rounded-lg border-0 bg-surface"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p className="text-sm text-muted">A trailer is not available for this movie.</p>
        )}
      </section>
    </main>
  );
}
