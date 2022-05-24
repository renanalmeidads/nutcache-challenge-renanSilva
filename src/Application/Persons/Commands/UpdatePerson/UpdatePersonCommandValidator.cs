using FluentValidation;

namespace PeopleManager.Application.Persons.Commands.UpdatePerson;

public class UpdatePersonCommandValidator : AbstractValidator<UpdatePersonCommand>
{
    public UpdatePersonCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must have a valid value.");

        RuleFor(x => x.Name)
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters.")
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.BirthDate)
            .NotEmpty().WithMessage("Birth date is required.");

        RuleFor(x => x.Gender)
            .MaximumLength(1).WithMessage("Gender must not exceed 1 characters.")
            .NotEmpty().WithMessage("Gender is required.");

        RuleFor(x => x.Email)
            .MaximumLength(100).WithMessage("Email must not exceed 100 characters.")
            .NotEmpty().WithMessage("Email is required.");

        RuleFor(x => x.Cpf)
            .MaximumLength(11).WithMessage("Cpf must not exceed 11 characters.")
            .NotEmpty().WithMessage("Cpf is required.");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required.");

        RuleFor(x => x.Team)
            .IsInEnum().WithMessage("Team must have a valid value.");
    }
}
