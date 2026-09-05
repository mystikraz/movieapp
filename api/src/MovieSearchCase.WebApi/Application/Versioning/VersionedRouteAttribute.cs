using Microsoft.AspNetCore.Mvc;

namespace MovieSearchCase.WebApi.Application.Versioning;

[AttributeUsage(AttributeTargets.Class)]
public class VersionedRouteAttribute : RouteAttribute
{
    public VersionedRouteAttribute()
        : base("api/v{version:apiVersion}/[controller]")
    {
    }
}
