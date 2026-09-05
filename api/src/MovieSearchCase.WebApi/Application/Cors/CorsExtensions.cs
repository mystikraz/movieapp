using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MovieSearchCase.WebApi.Application.Cors;

public static class CorsExtensions
{
    private const string PolicyName = "Default";

    public static IServiceCollection AddCorsDefaultPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        var corsOptions = configuration.GetSection("CorsPolicy").Get<CorsOptions>() ?? new CorsOptions();

        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy.WithOrigins(corsOptions.AllowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        return services;
    }

    public static IApplicationBuilder UseCorsDefaultPolicy(this IApplicationBuilder app) => app.UseCors(PolicyName);
}
