namespace MovieSearchCase.Domain.Entities;

/// <summary>
/// A page of movie search results together with the pagination metadata returned by TMDB.
/// </summary>
public record MovieSearchResult
{
    public required IReadOnlyList<Movie> Results { get; init; }

    public required int Page { get; init; }

    public required int TotalPages { get; init; }

    public required int TotalResults { get; init; }
}
