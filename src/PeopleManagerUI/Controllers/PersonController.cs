using Microsoft.AspNetCore.Mvc;
using PeopleManager.Application.Persons.Commands.CreatePerson;
using PeopleManager.Application.Persons.Commands.DeletePerson;
using PeopleManager.Application.Persons.Commands.ListPerson;
using PeopleManager.Application.Persons.Commands.UpdatePerson;
using PeopleManager.Application.Persons.Queries;

namespace PeopleManager.PeopleManagerUI.Controllers;

public class PersonController : ApiBaseController
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreatePersonCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpGet]
    public async Task<ActionResult<IList<PersonDto>>> Get()
    {
        var result = await Mediator.Send(new ListPersonCommand());

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await Mediator.Send(new DeletePersonCommand() { Id = id });

        return NoContent();
    }

    [HttpPut("[action]/{id}")]
    public async Task<ActionResult> Update(int id, UpdatePersonCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }
}