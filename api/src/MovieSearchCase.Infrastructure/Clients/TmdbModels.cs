using System.Text.Json.Serialization;

namespace MovieSearchCase.Infrastructure.Clients;

/// <summary>
/// Raw shapes returned by TMDB's REST API (https://developer.themoviedb.org/reference).
/// Kept separate from our own <see cref="Domain.Entities.Movie"/> so the API's response
/// shape never leaks TMDB's field naming/quirks directly to our consumers.
/// </summary>
public class TmdbPagedResponse<T>
{
    [JsonPropertyName("page")]
    public int Page { get; init; }

    [JsonPropertyName("results")]
    public required IReadOnlyList<T> Results { get; init; }

    [JsonPropertyName("total_pages")]
    public int TotalPages { get; init; }

    [JsonPropertyName("total_results")]
    public int TotalResults { get; init; }
}

public class TmdbMovie
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [JsonPropertyName("overview")]
    public string? Overview { get; init; }

    [JsonPropertyName("poster_path")]
    public string? PosterPath { get; init; }

    [JsonPropertyName("backdrop_path")]
    public string? BackdropPath { get; init; }

    [JsonPropertyName("vote_average")]
    public double VoteAverage { get; init; }

    [JsonPropertyName("release_date")]
    public string? ReleaseDate { get; init; }
}
