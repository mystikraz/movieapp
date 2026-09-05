using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MovieSearchCase.Domain.Interfaces.Clients;
using MovieSearchCase.Domain.Interfaces.Services;
using MovieSearchCase.Infrastructure.Clients;
using MovieSearchCase.Infrastructure.Services;
using MovieSearchCase.Shared.Extensions;

namespace MovieSearchCase.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IMovieService, MovieService>();

        return services;
    }

    public static IServiceCollection AddClients(this IServiceCollection services, IConfiguration configuration)
    {
        var tmdbOptions = configuration.GetSection(nameof(TmdbOptions)).Get<TmdbOptions>().ValidateOptions();

        services.AddHttpClient<ITmdbClient, TmdbClient>(client =>
        {
            client.BaseAddress = new Uri(tmdbOptions.BaseUrl);
            client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tmdbOptions.AccessToken);
        });

        return services;
    }
}
