using PeopleManager.Application.Common.Mappings;
using PeopleManager.Domain.Entities;
using PeopleManager.Domain.Enums;

namespace PeopleManager.Application.Persons.Queries;

public class PersonDto : IMapFrom<Person>
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public DateTime BirthDate { get; set; }

    public string? Gender { get; set; }

    public string? Email { get; set; }

    public string? Cpf { get; set; }

    public DateTime StartDate { get; set; }

    public Team Team { get; set; }
}
