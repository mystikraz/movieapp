namespace MovieSearchCase.WebApi.Mappers;

internal static class MovieMapper
{
    public static Models.Movies.Movie ToApiModel(this Domain.Entities.Movie movie) => new()
    {
        Id = movie.Id,
        Title = movie.Title,
        Overview = movie.Overview,
        PosterPath = movie.PosterPath,
        BackdropPath = movie.BackdropPath,
        VoteAverage = movie.VoteAverage,
        ReleaseDate = movie.ReleaseDate,
    };
}
