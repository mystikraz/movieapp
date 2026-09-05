using System.ComponentModel.DataAnnotations;

namespace MovieSearchCase.Infrastructure.Clients;

public class TmdbOptions
{
    [Required]
    public required string BaseUrl { get; init; }

    /// <summary>
    /// TMDB "API Read Access Token" (v4 auth) — get a free one at
    /// https://developer.themoviedb.org/docs/getting-started after signing up.
    /// </summary>
    [Required]
    public required string AccessToken { get; init; }
}
