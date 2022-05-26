using FluentValidation.AspNetCore;
using PeopleManager.Application;
using PeopleManager.Infrastructure;
using PeopleManager.PeopleManagerUI.Filters;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(o => o.AddPolicy(MyAllowSpecificOrigins,
        builder => builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()));

// Add services to the container.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllersWithViews(options =>
    options.Filters.Add<ApiExceptionFilterAttribute>())
        .AddFluentValidation(x => x.AutomaticValidationEnabled = false);

//builder.Services.AddHealthChecks()
    //.AddDbContextCheck<ApplicationDbContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");;

app.Run();

public partial class Program { }
