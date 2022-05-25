using PeopleManager.Domain.Enums;

namespace PeopleManager.Domain.Entities;

public class Person
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public DateTime BirthDate { get; set; }

    public Gender? Gender { get; set; }

    public string? Email { get; set; }

    public string? Cpf { get; set; }
    
    public DateTime StartDate { get; set; }

    public Team Team { get; set; }
}