using AdhDo.Api.Data;
using Microsoft.EntityFrameworkCore;
using Yarp.ReverseProxy.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=adh-do.db"));

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddReverseProxy()
        .LoadFromMemory(
            routes:
            [
                new RouteConfig
                {
                    RouteId = "vite-fallback",
                    ClusterId = "vite-cluster",
                    Match = new RouteMatch { Path = "{**catch-all}" }
                }
            ],
            clusters:
            [
                new ClusterConfig
                {
                    ClusterId = "vite-cluster",
                    Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
                    {
                        { "vite", new DestinationConfig { Address = "http://localhost:5173/" } }
                    }
                }
            ]
        );
}

var app = builder.Build();

// Auto-create schema on startup (no migrations needed)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    // Ensure UpdateRequests table exists for databases created before this table was added
    db.Database.ExecuteSqlRaw(@"
        CREATE TABLE IF NOT EXISTS ""UpdateRequests"" (
            ""Id"" INTEGER NOT NULL CONSTRAINT ""PK_UpdateRequests"" PRIMARY KEY AUTOINCREMENT,
            ""TodoId"" INTEGER NOT NULL,
            ""RequestedByUserId"" TEXT NOT NULL,
            ""RequestedAt"" TEXT NOT NULL,
            ""Response"" TEXT,
            ""RespondedAt"" TEXT,
            ""ResponseDismissed"" INTEGER NOT NULL DEFAULT 0
        )");
}

app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapReverseProxy();
}
else
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
    // Serve the SPA for all unmatched routes
    app.MapFallbackToFile("index.html");
}

app.Run();
