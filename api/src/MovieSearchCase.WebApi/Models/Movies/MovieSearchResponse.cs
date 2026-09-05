namespace MovieSearchCase.WebApi.Models.Movies;

/// <summary>
/// A paginated movie search response.
/// </summary>
public record MovieSearchResponse
{
    public required IReadOnlyList<Movie> Results { get; init; }

    public required int Page { get; init; }

    public required int TotalPages { get; init; }

    public required int TotalResults { get; init; }
}
