using Microsoft.AspNetCore.Mvc;
using MovieSearchCase.Domain.Interfaces.Services;
using MovieSearchCase.Shared;
using MovieSearchCase.WebApi.Mappers;

namespace MovieSearchCase.WebApi.Handlers.Movies;

public class GetTrendingMoviesHandler : IRequestHandlerAsync
{
    private readonly IMovieService _movieService;

    public GetTrendingMoviesHandler(IMovieService movieService)
    {
        _movieService = movieService;
    }

    public async Task<IActionResult> HandleAsync(HttpRequest request)
    {
        var movies = await _movieService.GetTrendingAsync(request.HttpContext.RequestAborted);

        return new OkObjectResult(movies.Select(movie => movie.ToApiModel()));
    }
}
