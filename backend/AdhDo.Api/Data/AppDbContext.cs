using AdhDo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AdhDo.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Todo> Todos => Set<Todo>();
    public DbSet<UpdateRequest> UpdateRequests => Set<UpdateRequest>();
}
