using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using MovieSearchCase.Domain.Entities;
using MovieSearchCase.Domain.Interfaces.Services;
using MovieSearchCase.WebApi.Handlers.Movies;
using MovieSearchCase.WebApi.Models.Movies;
using Xunit;
using DomainMovie = MovieSearchCase.Domain.Entities.Movie;

namespace MovieSearchCase.WebApi.Tests.Handlers;

public class GetMovieDetailsHandlerTests
{
    [Fact]
    public async Task HandleAsyncReturnsMappedMovieAndTrailer()
    {
        var movieServiceMock = new Mock<IMovieService>();
        movieServiceMock
            .Setup(service => service.GetDetailsAsync(42, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new MovieDetails
            {
                Movie = new DomainMovie { Id = 42, Title = "The Answer", VoteAverage = 9.2 },
                TrailerKey = "trailer-key",
            });
        var handler = new GetMovieDetailsHandler(movieServiceMock.Object, 42);

        var result = await handler.HandleAsync(new DefaultHttpContext().Request);

        var response = result.Should().BeOfType<OkObjectResult>().Subject.Value
            .Should().BeOfType<MovieDetailsResponse>().Subject;
        response.Movie.Id.Should().Be(42);
        response.Movie.Title.Should().Be("The Answer");
        response.TrailerKey.Should().Be("trailer-key");
    }
}
