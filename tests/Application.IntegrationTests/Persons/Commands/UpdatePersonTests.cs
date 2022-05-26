using FluentAssertions;
using NUnit.Framework;
using PeopleManager.Application.Common.Exceptions;
using PeopleManager.Application.Persons.Commands.CreatePerson;
using PeopleManager.Application.Persons.Commands.UpdatePerson;
using PeopleManager.Domain.Entities;
using PeopleManager.Domain.Enums;

namespace PeopleManager.Application.IntegrationTests.Persons.Commands;

using static Testing;

public class UpdatePersonTests : TestBase
{
    [Test]
    public async Task ShouldThrowNotFoundException()
    {
        var command = new UpdatePersonCommand
        {
            Id = 99,
            Name = "Renan",
            BirthDate = DateTime.Now,
            Cpf = "03722003385",
            Email = "teste@gmail.com",
            Gender = Gender.Masculine,
            StartDate = DateTime.Now,
            Team = Team.Backend
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

        var command = new UpdatePersonCommand
        {
            Id = personId,
            Name = "New name",
            BirthDate = DateTime.Now,
            Cpf = "03722003385",
            Email = "teste@gmail.com",
            Gender = Gender.Masculine,
            StartDate = DateTime.Now,
            Team = Team.Backend
        };

       await SendAsync(command);

       var person = await FindAsync<Person>(personId);

       person.Should().NotBeNull();
       person!.Name.Should().Be(command.Name);
    }
}

