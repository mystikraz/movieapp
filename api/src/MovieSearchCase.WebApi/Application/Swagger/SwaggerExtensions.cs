using Microsoft.OpenApi.Models;

namespace MovieSearchCase.WebApi.Application.Swagger;

public static class SwaggerExtensions
{
    public static IServiceCollection AddCustomSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Movie Search Case API",
                Version = "v1",
                Description = "TMDB-backed movie search API used for the DEPT full-stack hiring case.",
            });
            options.EnableAnnotations();
        });

        return services;
    }
}
