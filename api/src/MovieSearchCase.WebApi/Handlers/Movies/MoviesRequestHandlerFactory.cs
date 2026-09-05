using MovieSearchCase.Domain.Interfaces.Services;
using MovieSearchCase.Shared;

namespace MovieSearchCase.WebApi.Handlers.Movies;

public class MoviesRequestHandlerFactory : IMoviesRequestHandlerFactory
{
    private readonly IMovieService _movieService;

    public MoviesRequestHandlerFactory(IMovieService movieService)
    {
        _movieService = movieService;
    }

    public IRequestHandlerAsync GetTrendingMovies() => new GetTrendingMoviesHandler(_movieService);
}
