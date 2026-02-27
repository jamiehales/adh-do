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
