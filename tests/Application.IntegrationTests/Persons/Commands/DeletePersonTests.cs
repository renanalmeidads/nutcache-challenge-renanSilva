using FluentAssertions;
using NUnit.Framework;
using PeopleManager.Application.Common.Exceptions;
using PeopleManager.Application.Persons.Commands.CreatePerson;
using PeopleManager.Application.Persons.Commands.DeletePerson;
using PeopleManager.Application.Persons.Commands.UpdatePerson;
using PeopleManager.Domain.Entities;
using PeopleManager.Domain.Enums;

namespace PeopleManager.Application.IntegrationTests.Persons.Commands;

using static Testing;

public class DeletePersonTests : TestBase
{
    [Test]
    public async Task ShouldThrowNotFoundException()
    {
        var command = new DeletePersonCommand
        {
            Id = 99
        };

        await FluentActions.Invoking(() => SendAsync(command)).Should().ThrowAsync<NotFoundException>();
    }

    [Test]
    public async Task ShouldUpdatePerson()
    {
        var personId = await SendAsync(new CreatePersonCommand()
        {
            Name = "Renan",
            BirthDate = DateTime.Now,
            Cpf = "03722003385",
            Email = "teste@gmail.com",
            Gender = Gender.Masculine,
            StartDate = DateTime.Now,
            Team = Team.Backend
        });

        var command = new DeletePersonCommand
        {
            Id = personId
        };

        await SendAsync(command);

        var person = await FindAsync<Person>(personId);

        person.Should().BeNull();
    }
}