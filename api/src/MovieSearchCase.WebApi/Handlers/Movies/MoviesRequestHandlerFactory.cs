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

    public IRequestHandlerAsync SearchMovies(string query, int page) =>
        new SearchMoviesHandler(_movieService, query, page);

    public IRequestHandlerAsync GetMovieDetails(int movieId) =>
        new GetMovieDetailsHandler(_movieService, movieId);
}
