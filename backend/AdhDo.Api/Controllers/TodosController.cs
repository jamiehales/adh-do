using AdhDo.Api.Data;
using AdhDo.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdhDo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController(AppDbContext db) : ControllerBase
{
    private static readonly string[] ValidUsers = ["Jamie", "Ellie"];

    private static readonly Dictionary<string, int> ImportanceOrder = new()
    {
        { "I need this to happen",    4 },
        { "This is important to me",  3 },
        { "I would like this",        2 },
        { "If you could find time",   1 },
    };

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetForUser(string userId)
    {
        var canonical = ValidUsers.FirstOrDefault(u =>
            u.Equals(userId, StringComparison.OrdinalIgnoreCase));

        if (canonical is null)
            return BadRequest("Invalid user.");

        var todos = await db.Todos
            .Where(t => t.OwnerId == canonical && t.CompletedAt == null)
            .ToListAsync();

        var sorted = todos
            .OrderByDescending(t => t.Importance is null ? 0 : ImportanceOrder.GetValueOrDefault(t.Importance, 0))
            .ThenBy(t => t.DueDate ?? DateTime.MaxValue)
            .ThenByDescending(t => t.CreatedAt);

        return Ok(sorted);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTodoRequest request)
    {
        var owner = ValidUsers.FirstOrDefault(u =>
            u.Equals(request.OwnerId, StringComparison.OrdinalIgnoreCase));
        var requester = ValidUsers.FirstOrDefault(u =>
            u.Equals(request.RequestedById, StringComparison.OrdinalIgnoreCase));

        if (owner is null || requester is null)
            return BadRequest("Invalid user.");

        var todo = new Todo
        {
            Title        = request.Title.Trim(),
            Importance   = request.Importance,
            DueDate      = request.DueDate,
            OwnerId      = owner,
            RequestedById = requester,
            CreatedAt    = DateTime.UtcNow,
        };

        db.Todos.Add(todo);
        await db.SaveChangesAsync();

        return Created($"/api/todos/{todo.OwnerId}", todo);
    }

    // Mark a todo as complete
    [HttpPost("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        var todo = await db.Todos.FindAsync(id);
        if (todo is null) return NotFound();
        if (todo.CompletedAt is not null) return Ok(todo);

        todo.CompletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Ok(todo);
    }

    // Get completed todos that the requester hasn't been notified about yet
    [HttpGet("completions-for/{userId}")]
    public async Task<IActionResult> GetCompletionsFor(string userId)
    {
        var canonical = ValidUsers.FirstOrDefault(u =>
            u.Equals(userId, StringComparison.OrdinalIgnoreCase));

        if (canonical is null)
            return BadRequest("Invalid user.");

        var completions = await db.Todos
            .Where(t => t.RequestedById == canonical && t.CompletedAt != null && !t.CompletionDismissed)
            .ToListAsync();

        return Ok(completions);
    }

    // Dismiss a completion notification
    [HttpPost("{id}/dismiss-completion")]
    public async Task<IActionResult> DismissCompletion(int id)
    {
        var todo = await db.Todos.FindAsync(id);
        if (todo is null) return NotFound();

        todo.CompletionDismissed = true;
        await db.SaveChangesAsync();

        return Ok();
    }
}

public record CreateTodoRequest(
    string Title,
    string? Importance,
    DateTime? DueDate,
    string OwnerId,
    string RequestedById
);
