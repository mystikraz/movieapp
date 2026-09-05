namespace MovieSearchCase.WebApi.Models.Movies;

public record MovieDetailsResponse
{
    public required Movie Movie { get; init; }

    public string? TrailerKey { get; init; }
}
