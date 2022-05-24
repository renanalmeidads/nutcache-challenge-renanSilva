using Microsoft.EntityFrameworkCore;
using PeopleManager.Domain.Entities;

namespace PeopleManager.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Person> Persons { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}