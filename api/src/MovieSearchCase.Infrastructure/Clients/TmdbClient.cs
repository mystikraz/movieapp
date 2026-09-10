using System.Net;
using System.Net.Http.Json;
using MovieSearchCase.Domain.Entities;
using MovieSearchCase.Domain.Exceptions;
using MovieSearchCase.Domain.Interfaces.Clients;

namespace MovieSearchCase.Infrastructure.Clients;

public class TmdbClient : ITmdbClient
{
    private readonly HttpClient _httpClient;

    public TmdbClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IReadOnlyList<Movie>> GetTrendingMoviesAsync(CancellationToken cancellationToken)
    {
        TmdbPagedResponse<TmdbMovie>? response;

        try
        {
            response = await _httpClient.GetFromJsonAsync<TmdbPagedResponse<TmdbMovie>>(
                "trending/movie/week",
                cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB did not return trending movies.");
        }

        if (response is null)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB returned an empty trending movies response.");
        }

        return response.Results.Select(TmdbMovieMapper.ToDomainModel).ToList();
    }

    public async Task<MovieSearchResult> SearchMoviesAsync(string query, int page, CancellationToken cancellationToken)
    {
        TmdbPagedResponse<TmdbMovie>? response;
        var requestUri = $"search/movie?query={Uri.EscapeDataString(query)}&page={page}";

        try
        {
            response = await _httpClient.GetFromJsonAsync<TmdbPagedResponse<TmdbMovie>>(
                requestUri,
                cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB did not return movie search results.");
        }

        if (response is null)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB returned an empty movie search response.");
        }

        return new MovieSearchResult
        {
            Results = response.Results.Select(TmdbMovieMapper.ToDomainModel).ToList(),
            Page = response.Page,
            TotalPages = response.TotalPages,
            TotalResults = response.TotalResults,
        };
    }

    public async Task<MovieDetails> GetMovieDetailsAsync(int movieId, CancellationToken cancellationToken)
    {
        TmdbMovie? movie;

        try
        {
            movie = await _httpClient.GetFromJsonAsync<TmdbMovie>($"movie/{movieId}", cancellationToken);
        }
        catch (HttpRequestException exception) when (exception.StatusCode == HttpStatusCode.NotFound)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.EntityNotFound,
                "The requested movie was not found.");
        }
        catch (HttpRequestException)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB did not return movie details.");
        }

        if (movie is null)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB returned an empty movie details response.");
        }

        return new MovieDetails
        {
            Movie = movie.ToDomainModel(),
            TrailerKey = await GetTrailerKeyAsync(movieId, cancellationToken),
        };
    }

    private async Task<string?> GetTrailerKeyAsync(int movieId, CancellationToken cancellationToken)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<TmdbVideoResponse>(
                $"movie/{movieId}/videos",
                cancellationToken);

            return response?.Results
                .Where(video => video.Site == "YouTube" && video.Type == "Trailer")
                .OrderByDescending(video => video.Official)
                .Select(video => video.Key)
                .FirstOrDefault();
        }
        catch (HttpRequestException)
        {
            return null;
        }
    }
}
