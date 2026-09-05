namespace MovieSearchCase.Domain.Exceptions;

public class MovieException : ProblemDetailsException
{
    public const string ExceptionTitle = "Movie request failed";

    public MovieException(string title, ErrorType errorType, string details, Uri? instance = null)
        : base(title, errorType, details, instance)
    {
    }
}
