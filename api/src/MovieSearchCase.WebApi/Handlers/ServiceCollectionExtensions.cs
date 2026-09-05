using MovieSearchCase.WebApi.Handlers.Movies;

namespace MovieSearchCase.WebApi.Handlers;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRequestHandlerFactories(this IServiceCollection services)
    {
        services.AddScoped<IMoviesRequestHandlerFactory, MoviesRequestHandlerFactory>();

        return services;
    }
}
