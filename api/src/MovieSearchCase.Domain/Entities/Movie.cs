namespace MovieSearchCase.Domain.Entities;

public class Movie
{
    public required int Id { get; init; }

    public required string Title { get; init; }

    public string? Overview { get; init; }

    public string? PosterPath { get; init; }

    public string? BackdropPath { get; init; }

    public double VoteAverage { get; init; }

    public DateOnly? ReleaseDate { get; init; }
}
