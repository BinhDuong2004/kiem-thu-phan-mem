using Microsoft.EntityFrameworkCore;
using server;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
  options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
  options.UseMySql(AppDbContext.connectionString, new MySqlServerVersion(new Version(8, 0, 36)));
});
builder.Services.AddCors(options =>
  options.AddDefaultPolicy(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();
// app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
