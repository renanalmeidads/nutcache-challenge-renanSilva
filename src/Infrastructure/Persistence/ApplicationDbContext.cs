using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PeopleManager.Application.Common.Interfaces;
using PeopleManager.Domain.Entities;

namespace PeopleManager.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }

    public DbSet<Person> Persons => Set<Person>();

    public async Task<int> SaveCangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        var result = await base.SaveChangesAsync(cancellationToken);

        return result;
    }
}