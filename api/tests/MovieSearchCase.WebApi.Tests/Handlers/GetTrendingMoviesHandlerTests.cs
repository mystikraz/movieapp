using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using MovieSearchCase.Domain.Entities;
using MovieSearchCase.Domain.Interfaces.Services;
using MovieSearchCase.WebApi.Handlers.Movies;
using Xunit;
using ApiMovie = MovieSearchCase.WebApi.Models.Movies.Movie;

namespace MovieSearchCase.WebApi.Tests.Handlers;

public class GetTrendingMoviesHandlerTests
{
    [Fact]
    public async Task HandleShouldReturnOkWithMappedMoviesWhenServiceSucceeds()
    {
        var trending = new List<Movie>
        {
            new()
            {
                Id = 1,
                Title = "A Trending Movie",
                VoteAverage = 8.1,
            },
        };

        var movieServiceMock = new Mock<IMovieService>();
        movieServiceMock
            .Setup(service => service.GetTrendingAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(trending);

        var handler = new GetTrendingMoviesHandler(movieServiceMock.Object);
        var httpContext = new DefaultHttpContext();

        var result = await handler.HandleAsync(httpContext.Request);

        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var movies = okResult.Value.Should().BeAssignableTo<IEnumerable<ApiMovie>>().Subject;
        movies.Should().ContainSingle(movie => movie.Id == 1 && movie.Title == "A Trending Movie");
    }
}
