using MediatR;

using Microsoft.AspNetCore.Mvc;

namespace PeopleManager.PeopleManagerUI.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiBaseController : ControllerBase
{
    private ISender _mediator = null!;

    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
}