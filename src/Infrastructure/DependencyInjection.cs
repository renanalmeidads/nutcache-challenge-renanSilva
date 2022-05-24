using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using PeopleManager.Infrastructure.Persistence;
using PeopleManager.Application.Common.Interfaces;

namespace PeopleManager.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this  IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options => options.UseInMemoryDatabase("PeopleManagerDb"));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        return services;
    }
}