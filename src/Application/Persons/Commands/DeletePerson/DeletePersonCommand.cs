using MediatR;
using PeopleManager.Application.Common.Exceptions;
using PeopleManager.Application.Common.Interfaces;
using PeopleManager.Domain.Entities;

namespace PeopleManager.Application.Persons.Commands.DeletePerson;

public class DeletePersonCommand : IRequest
{
    public int Id { get; set; }
}

public class DeletePersonCommandHandler : IRequestHandler<DeletePersonCommand>
{
    private readonly IApplicationDbContext _context;

    public DeletePersonCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeletePersonCommand request, CancellationToken cancellationToken)
    {
        var person = await _context.Persons.FindAsync(new object[] { request.Id }, cancellationToken);

        if (person == null)
        {
            throw new NotFoundException(nameof(Person), request.Id);
        }

        _context.Persons.Remove(person);

        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
