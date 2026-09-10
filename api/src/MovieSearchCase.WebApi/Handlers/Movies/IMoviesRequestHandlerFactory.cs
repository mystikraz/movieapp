using MovieSearchCase.Shared;

namespace MovieSearchCase.WebApi.Handlers.Movies;

public interface IMoviesRequestHandlerFactory
{
    IRequestHandlerAsync GetTrendingMovies();

    IRequestHandlerAsync SearchMovies(string query, int page);

    IRequestHandlerAsync GetMovieDetails(int movieId);
}
