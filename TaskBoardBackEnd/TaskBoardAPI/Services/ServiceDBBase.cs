using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;

namespace TaskBoardAPI.Services
{
    public class ServiceDBBase
    {
        private readonly IDbContextFactory<BoardTasksDbContext> dbContextFactory;

        public ServiceDBBase(IDbContextFactory<BoardTasksDbContext> contextFactory)
        {
            dbContextFactory = contextFactory;
        }

        protected async Task<BoardTasksDbContext> CreateDbContextAsync(CancellationToken cancelentionToken)
        {
            return await dbContextFactory.CreateDbContextAsync(cancelentionToken);
        }
    }
}
