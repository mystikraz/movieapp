using System.Net;

namespace MovieSearchCase.Domain.Exceptions;

public enum ErrorType
{
    Unknown = HttpStatusCode.InternalServerError,
    EntityNotFound = HttpStatusCode.NotFound,
    UpstreamServiceUnavailable = HttpStatusCode.ServiceUnavailable,
    InvalidRequest = HttpStatusCode.BadRequest,
}

public static class ErrorTypeExtensions
{
    public static int ToStatusCode(this ErrorType errorType) => (int)errorType;
}
