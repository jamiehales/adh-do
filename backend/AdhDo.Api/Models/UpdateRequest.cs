namespace AdhDo.Api.Models;

public class UpdateRequest
{
    public int Id { get; set; }
    public int TodoId { get; set; }
    public string RequestedByUserId { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public string? Response { get; set; }
    public DateTime? RespondedAt { get; set; }
    public bool ResponseDismissed { get; set; }
}
