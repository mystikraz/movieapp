using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;

namespace MovieSearchCase.WebApi.Controllers;

[ApiController]
[Produces(MediaTypeNames.Application.Json)]
public class ApiControllerBase : ControllerBase
{
}
