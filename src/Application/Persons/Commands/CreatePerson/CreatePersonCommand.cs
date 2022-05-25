using MediatR;
using PeopleManager.Application.Common.Interfaces;
using PeopleManager.Domain.Entities;
using PeopleManager.Domain.Enums;

namespace PeopleManager.Application.Persons.Commands.CreatePerson;

public class CreatePersonCommand : IRequest<int>
{
    public string? Name { get; set; }

    public DateTime BirthDate { get; set; }

    public Gender? Gender { get; set; }

    public string? Email { get; set; }

    public string? Cpf { get; set; }

    public DateTime StartDate { get; set; }

    public Team Team { get; set; }
}

public class CreatePersonCommandHandler : IRequestHandler<CreatePersonCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreatePersonCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreatePersonCommand request, CancellationToken cancellationToken)
    {
        var person = new Person
        {
            Name = request.Name,
            BirthDate = request.BirthDate,
            Gender = request.Gender,
            Email = request.Email,
            Cpf = request.Cpf,
            Team = request.Team,
            StartDate = request.StartDate
        };

        _context.Persons.Add(person);

        await _context.SaveChangesAsync(cancellationToken);

        return person.Id;
    }
}