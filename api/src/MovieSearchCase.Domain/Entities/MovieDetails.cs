namespace MovieSearchCase.Domain.Entities;

public record MovieDetails
{
    public required Movie Movie { get; init; }

    public string? TrailerKey { get; init; }
}
