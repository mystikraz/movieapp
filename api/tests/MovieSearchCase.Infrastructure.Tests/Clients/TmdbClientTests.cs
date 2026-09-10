using System.Net;
using FluentAssertions;
using MovieSearchCase.Domain.Exceptions;
using MovieSearchCase.Infrastructure.Clients;
using Xunit;

namespace MovieSearchCase.Infrastructure.Tests.Clients;

public class TmdbClientTests
{
    [Fact]
    public async Task GetMovieDetailsAsyncReturnsMovieAndNullTrailerWhenVideosAreUnavailable()
    {
        using var httpClient = CreateHttpClient(request => request.RequestUri!.AbsolutePath switch
        {
            "/3/movie/42" => JsonResponse("""
                { "id": 42, "title": "The Answer", "vote_average": 9.2, "release_date": "2024-05-01" }
                """),
            "/3/movie/42/videos" => new HttpResponseMessage(HttpStatusCode.ServiceUnavailable),
            _ => new HttpResponseMessage(HttpStatusCode.NotFound),
        });
        var client = new TmdbClient(httpClient);

        var result = await client.GetMovieDetailsAsync(42, CancellationToken.None);

        result.Movie.Id.Should().Be(42);
        result.Movie.Title.Should().Be("The Answer");
        result.TrailerKey.Should().BeNull();
    }

    [Fact]
    public async Task GetMovieDetailsAsyncThrowsNotFoundWhenTmdbDoesNotFindTheMovie()
    {
        using var httpClient = CreateHttpClient(_ => new HttpResponseMessage(HttpStatusCode.NotFound));
        var client = new TmdbClient(httpClient);

        var action = () => client.GetMovieDetailsAsync(404, CancellationToken.None);

        var exception = await action.Should().ThrowAsync<MovieException>();
        exception.Which.ErrorCode.Should().Be(ErrorType.EntityNotFound);
    }

    private static HttpClient CreateHttpClient(Func<HttpRequestMessage, HttpResponseMessage> responder) => new(
        new StubHttpMessageHandler(responder))
    {
        BaseAddress = new Uri("https://api.themoviedb.org/3/"),
    };

    private static HttpResponseMessage JsonResponse(string content) => new(HttpStatusCode.OK)
    {
        Content = new StringContent(content, System.Text.Encoding.UTF8, "application/json"),
    };

    private sealed class StubHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> responder) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) =>
            Task.FromResult(responder(request));
    }
}
