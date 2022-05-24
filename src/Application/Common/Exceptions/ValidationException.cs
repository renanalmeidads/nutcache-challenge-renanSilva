using FluentValidation.Results;

namespace PeopleManager.Application.Common.Exceptions;

public class ValidationException : Exception
{
    public IDictionary<string, string[]> _errors { get; }

    public ValidationException() : base("One or more validation failures have occurred.")
    {
        _errors = new Dictionary<string, string[]>();
    }

    public ValidationException(IEnumerable<ValidationFailure> failures)
        : this()
    {
        _errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
    }
}

