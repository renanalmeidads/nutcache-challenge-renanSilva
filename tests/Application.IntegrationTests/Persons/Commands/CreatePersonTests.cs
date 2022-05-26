using FluentAssertions;
using NUnit.Framework;
using PeopleManager.Application.Common.Exceptions;
using PeopleManager.Application.Persons.Commands.CreatePerson;
using PeopleManager.Domain.Enums;

namespace PeopleManager.Application.IntegrationTests.Persons.Commands;

using static Testing;

public class CreatePersonTests : TestBase
{
    [Test]
    public async Task ShouldRequireMinimumFields()
    {
        var command = new CreatePersonCommand();

        await FluentActions.Invoking(() =>
            SendAsync(command)).Should().ThrowAsync<ValidationException>();
    }

    [Test]
    public async Task ShouldCreatePerson()
    {

        var command = new CreatePersonCommand()
        {
            Name = "Renan",
            BirthDate = DateTime.Now,
            Cpf = "03722003385",
            Email = "teste@gmail.com",
            Gender = Gender.Masculine,
            StartDate = DateTime.Now,
            Team = Team.Backend
        };

        var personId = await SendAsync(command);

        personId.Should().BeGreaterThan(0);
    }
}

