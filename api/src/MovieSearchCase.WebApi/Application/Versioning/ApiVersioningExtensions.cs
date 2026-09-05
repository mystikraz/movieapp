using Asp.Versioning;

namespace MovieSearchCase.WebApi.Application.Versioning;

public static class ApiVersioningExtensions
{
    public static IServiceCollection AddSupportToApiVersioning(this IServiceCollection services)
    {
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1, 0);
            options.AssumeDefaultVersionWhenUnspecified = true;
            options.ReportApiVersions = true;
        });

        return services;
    }
}
