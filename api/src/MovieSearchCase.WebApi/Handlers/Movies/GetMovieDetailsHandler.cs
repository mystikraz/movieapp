using Microsoft.AspNetCore.Mvc;
using MovieSearchCase.Domain.Interfaces.Services;
using MovieSearchCase.Shared;
using MovieSearchCase.WebApi.Mappers;
using MovieSearchCase.WebApi.Models.Movies;

namespace MovieSearchCase.WebApi.Handlers.Movies;

public class GetMovieDetailsHandler : IRequestHandlerAsync
{
    private readonly IMovieService _movieService;
    private readonly int _movieId;

    public GetMovieDetailsHandler(IMovieService movieService, int movieId)
    {
        _movieService = movieService;
        _movieId = movieId;
    }

    public async Task<IActionResult> HandleAsync(HttpRequest request)
    {
        var details = await _movieService.GetDetailsAsync(_movieId, request.HttpContext.RequestAborted);

        return new OkObjectResult(new MovieDetailsResponse
        {
            Movie = details.Movie.ToApiModel(),
            TrailerKey = details.TrailerKey,
        });
    }
}
