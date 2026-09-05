using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MovieSearchCase.Shared;

public interface IRequestHandlerAsync
{
    Task<IActionResult> HandleAsync(HttpRequest request);
}
