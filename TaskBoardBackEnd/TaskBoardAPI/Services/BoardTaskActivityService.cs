using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public class BoardTaskActivityService(IDbContextFactory<BoardTasksDbContext> contextFactory) : ServiceDBBase(contextFactory), IBoardTaskActivityService
    {
        public async Task<BoardTaskActivity?> GetTaskActivityByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTaskActivity? taskActivity;
                if (isTrackable)
                {
                    taskActivity = await dbContext.BoardTaskActivities
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                }
                else
                {
                    taskActivity = await dbContext.BoardTaskActivities.AsNoTracking()
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                }
                return taskActivity;
            }
        }
        public async Task<IEnumerable<BoardTaskActivity>> GetTaskActivitiesByTaskIdAsync(string taskId, CancellationToken cancellationToken = default)
        {
            List<BoardTaskActivity> taskActivities = new List<BoardTaskActivity>();
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                taskActivities.AddRange(
                        await dbContext.BoardTaskActivities
                        .Where(x => x.BoardTaskId == taskId)
                        .OrderByDescending(x => x.ActivityTime)
                        .AsNoTracking()
                        .ToListAsync(cancellationToken));
            }
            return taskActivities;
        }
        public async Task<BoardTaskActivity> CreateTaskBoardActivityAsync(BoardTaskActivity taskActivity, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                taskActivity.ActivityTime = DateTime.UtcNow;
                await dbContext.AddAsync(taskActivity, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return taskActivity;
            }
        }
    }
}
