using MediatR;
using PeopleManager.Application.Common.Exceptions;
using PeopleManager.Application.Common.Interfaces;
using PeopleManager.Domain.Entities;
using PeopleManager.Domain.Enums;

namespace PeopleManager.Application.Persons.Commands.UpdatePerson;

public class UpdatePersonCommand : IRequest
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

public class UpdatePersonCommandHandler : IRequestHandler<UpdatePersonCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdatePersonCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdatePersonCommand request, CancellationToken cancellationToken)
    {
        var person = await _context.Persons.FindAsync(new object[] { request.Id }, cancellationToken);

        if (person == null)
        {
            throw new NotFoundException(nameof(Person), request.Id);
        }

        person.Name = request.Name;
        person.BirthDate = request.BirthDate;
        person.Gender = request.Gender;
        person.Email = request.Email;
        person.Cpf = request.Cpf;
        person.StartDate = request.StartDate;
        person.Team = request.Team;

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}


