using Microsoft.AspNetCore.Mvc.Infrastructure;
using MovieSearchCase.Domain.Exceptions;

namespace MovieSearchCase.WebApi.Application.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext, ProblemDetailsFactory problemDetailsFactory)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception exception)
        {
            var (statusCode, title, detail, instance) = exception switch
            {
                ProblemDetailsException problemDetailsException => (
                    problemDetailsException.ErrorCode.ToStatusCode(),
                    problemDetailsException.Title,
                    problemDetailsException.Message,
                    problemDetailsException.Instance.ToString()),
                HttpRequestException => (
                    StatusCodes.Status503ServiceUnavailable,
                    "Upstream service unavailable",
                    exception.Message,
                    httpContext.Request.Path.ToString()),
                _ => (
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred",
                    exception.Message,
                    httpContext.Request.Path.ToString()),
            };

            _logger.LogError(exception, "Request to {Path} failed with status {StatusCode}", httpContext.Request.Path, statusCode);

            var problemDetails = problemDetailsFactory.CreateProblemDetails(
                httpContext,
                statusCode,
                title,
                instance: instance,
                detail: detail);

            httpContext.Response.ContentType = "application/problem+json";
            httpContext.Response.StatusCode = statusCode;
            await httpContext.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}

public static class RequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder app) =>
        app.UseMiddleware<RequestLoggingMiddleware>();
}
