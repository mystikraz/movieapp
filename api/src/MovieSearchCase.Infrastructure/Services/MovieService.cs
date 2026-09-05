using MovieSearchCase.Domain.Entities;
using MovieSearchCase.Domain.Interfaces.Clients;
using MovieSearchCase.Domain.Interfaces.Services;

namespace MovieSearchCase.Infrastructure.Services;

public class MovieService : IMovieService
{
    private readonly ITmdbClient _tmdbClient;

    public MovieService(ITmdbClient tmdbClient)
    {
        _tmdbClient = tmdbClient;
    }

    public Task<IReadOnlyList<Movie>> GetTrendingAsync(CancellationToken cancellationToken) =>
        _tmdbClient.GetTrendingMoviesAsync(cancellationToken);

    // TODO(candidate): add a search method here that calls ITmdbClient's new search method.
}
