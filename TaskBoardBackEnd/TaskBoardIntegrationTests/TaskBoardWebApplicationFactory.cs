using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TaskBoardAPI.Data;

namespace TaskBoardIntegrationTests
{
    internal class TaskBoardWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            base.ConfigureWebHost(builder);
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll(typeof(DbContextOptions<BoardTasksDbContext>));
                services.RemoveAll(typeof(BoardTasksDbContext));
                services.RemoveAll(typeof(IDbContextFactory<BoardTasksDbContext>));

                var conn = new SqliteConnection("DataSource=:memory:");
                conn.Open();
                services.AddDbContextFactory<BoardTasksDbContext>(options =>
                   options.UseSqlite(conn));

                var serviceProvider = services.BuildServiceProvider();
                using var scope = serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<BoardTasksDbContext>();
                dbContext.Database.EnsureCreated();
            });
        }
    }
}