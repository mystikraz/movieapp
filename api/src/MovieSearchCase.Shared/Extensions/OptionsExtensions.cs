using System.ComponentModel.DataAnnotations;

namespace MovieSearchCase.Shared.Extensions;

public static class OptionsExtensions
{
    public static TOptions ValidateOptions<TOptions>(this TOptions? options)
        where TOptions : class
    {
        if (options is null)
        {
            throw new ValidationException($"Configuration section for {typeof(TOptions).Name} is missing.");
        }

        Validator.ValidateObject(options, new ValidationContext(options), validateAllProperties: true);

        return options;
    }
}
