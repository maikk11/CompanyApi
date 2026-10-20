using Microsoft.EntityFrameworkCore;
using CompanyApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<CompanyDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CompanyDB")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend_Angular", policy =>
    {
       policy.WithOrigins("http://localhost:4200")
                        .AllowAnyMethod().AllowAnyHeader(); 
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("Frontend_Angular");

app.UseAuthorization();

app.MapControllers();

app.Run();
