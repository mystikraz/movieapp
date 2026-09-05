using MovieSearchCase.Infrastructure.Extensions;
using MovieSearchCase.WebApi.Application.Cors;
using MovieSearchCase.WebApi.Application.Middleware;
using MovieSearchCase.WebApi.Application.ProblemDetails;
using MovieSearchCase.WebApi.Application.Swagger;
using MovieSearchCase.WebApi.Application.Versioning;
using MovieSearchCase.WebApi.Handlers;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.Development.local.json", optional: true, reloadOnChange: true);

builder.Services
    .AddControllers().Services
    .AddCustomProblemDetails()
    .AddCustomSwagger()
    .AddCorsDefaultPolicy(builder.Configuration)
    .AddSupportToApiVersioning()
    .AddServices()
    .AddClients(builder.Configuration)
    .AddRequestHandlerFactories();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRequestLogging();
app.UseHttpsRedirection();
app.UseCorsDefaultPolicy();
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program
{
}
