namespace MovieSearchCase.Domain.Exceptions;

public abstract class ProblemDetailsException : Exception
{
    protected ProblemDetailsException(string title, ErrorType errorType, string details, Uri? instance = null)
        : base(details)
    {
        Title = title;
        ErrorCode = errorType;
        Details = details;
        Instance = instance ?? new Uri("about:blank");
    }

    public string Title { get; }

    public ErrorType ErrorCode { get; }

    public string Details { get; }

    public Uri Instance { get; }
}
