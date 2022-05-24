using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PeopleManager.Application.Common.Interfaces;
using PeopleManager.Application.Common.Mappings;
using PeopleManager.Application.Persons.Queries;

namespace PeopleManager.Application.Persons.Commands.ListPerson;

public class ListPersonCommand : IRequest<IList<PersonDto>>
{

}

public class ListPersonCommandHandler : IRequestHandler<ListPersonCommand, IList<PersonDto>>
{
    private readonly IApplicationDbContext _context;

    private readonly IMapper _mapper;

    public ListPersonCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IList<PersonDto>> Handle(ListPersonCommand request, CancellationToken cancellationToken)
    {
        return await _context
            .Persons
            .AsQueryable()
            .ProjectTo<PersonDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }
}

