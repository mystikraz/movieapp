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

public class SearchMoviesHandlerTests
{
    [Fact]
    public async Task HandleAsyncReturnsMappedResultsAndPagination()
    {
        var searchResult = new MovieSearchResult
        {
            Results = [new DomainMovie { Id = 1, Title = "A Movie", VoteAverage = 8.1 }],
            Page = 2,
            TotalPages = 4,
            TotalResults = 73,
        };
        var movieServiceMock = new Mock<IMovieService>();
        movieServiceMock
            .Setup(service => service.SearchAsync("movie", 2, It.IsAny<CancellationToken>()))
            .ReturnsAsync(searchResult);
        var handler = new SearchMoviesHandler(movieServiceMock.Object, "movie", 2);
        var httpContext = new DefaultHttpContext();

        var result = await handler.HandleAsync(httpContext.Request);

        var response = result.Should().BeOfType<OkObjectResult>().Subject.Value
            .Should().BeOfType<MovieSearchResponse>().Subject;
        response.Page.Should().Be(2);
        response.TotalPages.Should().Be(4);
        response.TotalResults.Should().Be(73);
        response.Results.Should().ContainSingle(movie => movie.Id == 1 && movie.Title == "A Movie");
    }

    [Fact]
    public async Task HandleAsyncReturnsAnEmptyResultPage()
    {
        var movieServiceMock = new Mock<IMovieService>();
        movieServiceMock
            .Setup(service => service.SearchAsync("missing", 1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new MovieSearchResult
            {
                Results = [],
                Page = 1,
                TotalPages = 0,
                TotalResults = 0,
            });
        var handler = new SearchMoviesHandler(movieServiceMock.Object, "missing", 1);

        var result = await handler.HandleAsync(new DefaultHttpContext().Request);

        var response = result.Should().BeOfType<OkObjectResult>().Subject.Value
            .Should().BeOfType<MovieSearchResponse>().Subject;
        response.Results.Should().BeEmpty();
        response.TotalResults.Should().Be(0);
    }
}
