using AdhDo.Api.Data;
using AdhDo.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdhDo.Api.Controllers;

[ApiController]
[Route("api/update-requests")]
public class UpdateRequestsController(AppDbContext db) : ControllerBase
{
    private static readonly string[] ValidUsers = ["Jamie", "Ellie"];

    // Create an update request for a todo
    [HttpPost]
    public async Task<IActionResult> Create(CreateUpdateRequestBody body)
    {
        var requester = ValidUsers.FirstOrDefault(u =>
            u.Equals(body.RequestedByUserId, StringComparison.OrdinalIgnoreCase));

        if (requester is null)
            return BadRequest("Invalid user.");

        var todo = await db.Todos.FindAsync(body.TodoId);
        if (todo is null)
            return NotFound("Todo not found.");

        // Prevent duplicate pending requests from the same user
        var existing = await db.UpdateRequests.FirstOrDefaultAsync(r =>
            r.TodoId == body.TodoId &&
            r.RequestedByUserId == requester &&
            r.Response == null);

        if (existing is not null)
            return Ok(existing);

        var updateRequest = new UpdateRequest
        {
            TodoId = body.TodoId,
            RequestedByUserId = requester,
            RequestedAt = DateTime.UtcNow,
        };

        db.UpdateRequests.Add(updateRequest);
        await db.SaveChangesAsync();

        return Created($"/api/update-requests/{updateRequest.Id}", updateRequest);
    }

    // Requests that need this user to respond to (they own the todo, response is null)
    [HttpGet("pending-for/{userId}")]
    public async Task<IActionResult> GetPendingFor(string userId)
    {
        var canonical = ValidUsers.FirstOrDefault(u =>
            u.Equals(userId, StringComparison.OrdinalIgnoreCase));

        if (canonical is null)
            return BadRequest("Invalid user.");

        var result = await (
            from r in db.UpdateRequests
            join t in db.Todos on r.TodoId equals t.Id
            where t.OwnerId == canonical && r.Response == null
            select new PendingUpdateRequestDto(r.Id, r.TodoId, t.Title, r.RequestedByUserId, r.RequestedAt)
        ).ToListAsync();

        return Ok(result);
    }

    // Responses the requester hasn't dismissed yet
    [HttpGet("responses-for/{userId}")]
    public async Task<IActionResult> GetResponsesFor(string userId)
    {
        var canonical = ValidUsers.FirstOrDefault(u =>
            u.Equals(userId, StringComparison.OrdinalIgnoreCase));

        if (canonical is null)
            return BadRequest("Invalid user.");

        var result = await (
            from r in db.UpdateRequests
            join t in db.Todos on r.TodoId equals t.Id
            where r.RequestedByUserId == canonical && r.Response != null && !r.ResponseDismissed
            select new UpdateResponseDto(r.Id, r.TodoId, t.Title, r.Response!, r.RespondedAt!.Value)
        ).ToListAsync();

        return Ok(result);
    }

    // Pending outgoing requests this user has made (so frontend can show "waiting" state)
    [HttpGet("outgoing/{userId}")]
    public async Task<IActionResult> GetOutgoing(string userId)
    {
        var canonical = ValidUsers.FirstOrDefault(u =>
            u.Equals(userId, StringComparison.OrdinalIgnoreCase));

        if (canonical is null)
            return BadRequest("Invalid user.");

        var todoIds = await db.UpdateRequests
            .Where(r => r.RequestedByUserId == canonical && r.Response == null)
            .Select(r => r.TodoId)
            .ToListAsync();

        return Ok(todoIds);
    }

    // Submit a response
    [HttpPost("{id}/respond")]
    public async Task<IActionResult> Respond(int id, RespondBody body)
    {
        var request = await db.UpdateRequests.FindAsync(id);
        if (request is null)
            return NotFound();

        request.Response = body.Response.Trim();
        request.RespondedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Ok(request);
    }

    // Dismiss a response (requester has seen it)
    [HttpPost("{id}/dismiss")]
    public async Task<IActionResult> Dismiss(int id)
    {
        var request = await db.UpdateRequests.FindAsync(id);
        if (request is null)
            return NotFound();

        request.ResponseDismissed = true;
        await db.SaveChangesAsync();

        return Ok();
    }

    // Most recent response per todo, for todos requested by this user
    [HttpGet("updates-for-todos/{userId}")]
    public async Task<IActionResult> GetUpdatesForTodos(string userId)
    {
        var canonical = ValidUsers.FirstOrDefault(u =>
            u.Equals(userId, StringComparison.OrdinalIgnoreCase));

        if (canonical is null)
            return BadRequest("Invalid user.");

        var all = await (
            from r in db.UpdateRequests
            join t in db.Todos on r.TodoId equals t.Id
            where t.RequestedById == canonical && r.Response != null
            orderby r.RespondedAt descending
            select new TodoLastUpdateDto(r.TodoId, t.OwnerId, r.Response!, r.RespondedAt!.Value)
        ).ToListAsync();

        var latest = all
            .GroupBy(x => x.TodoId)
            .Select(g => g.First())
            .ToList();

        return Ok(latest);
    }

    // Volunteer an update without being asked
    [HttpPost("volunteer")]
    public async Task<IActionResult> Volunteer(VolunteerUpdateBody body)
    {
        var owner = ValidUsers.FirstOrDefault(u =>
            u.Equals(body.OwnerUserId, StringComparison.OrdinalIgnoreCase));

        if (owner is null)
            return BadRequest("Invalid user.");

        var todo = await db.Todos.FindAsync(body.TodoId);
        if (todo is null)
            return NotFound("Todo not found.");

        if (todo.OwnerId != owner)
            return BadRequest("User is not the owner of this todo.");

        var now = DateTime.UtcNow;
        var updateRequest = new UpdateRequest
        {
            TodoId = body.TodoId,
            RequestedByUserId = todo.RequestedById,
            RequestedAt = now,
            Response = body.Message.Trim(),
            RespondedAt = now,
        };

        db.UpdateRequests.Add(updateRequest);
        await db.SaveChangesAsync();

        return Created($"/api/update-requests/{updateRequest.Id}", updateRequest);
    }
}

public record CreateUpdateRequestBody(int TodoId, string RequestedByUserId);
public record RespondBody(string Response);
public record VolunteerUpdateBody(int TodoId, string OwnerUserId, string Message);
public record TodoLastUpdateDto(int TodoId, string OwnerId, string Response, DateTime RespondedAt);

public record PendingUpdateRequestDto(
    int Id,
    int TodoId,
    string TodoTitle,
    string RequestedByUserId,
    DateTime RequestedAt);

public record UpdateResponseDto(
    int Id,
    int TodoId,
    string TodoTitle,
    string Response,
    DateTime RespondedAt);
