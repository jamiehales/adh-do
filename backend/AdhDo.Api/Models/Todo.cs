namespace AdhDo.Api.Models;

public class Todo
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Importance { get; set; }
    public DateTime? DueDate { get; set; }
    public string OwnerId { get; set; } = string.Empty;
    public string RequestedById { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public bool CompletionDismissed { get; set; }
}
