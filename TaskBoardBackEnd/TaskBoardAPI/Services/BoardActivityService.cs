using AutoMapper.Internal;
using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public class BoardActivityService(IDbContextFactory<BoardTasksDbContext> contextFactory) : ServiceDBBase(contextFactory), IBoardActivityService
    {
        public async Task<BoardActivity?> GetActivityByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardActivity? boardActivity;
                if (isTrackable)
                {
                    boardActivity = await dbContext.BoardActivities
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                }
                else
                {
                    boardActivity = await dbContext.BoardActivities.AsNoTracking()
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                }
                return boardActivity;
            }
        }
        public async Task<IEnumerable<BoardActivity>> GetActivitiesOnPageByBoardIdAsync(string id, int page, int amountObjectsPerPage, CancellationToken cancellationToken = default)
        {
            List<BoardActivity> activitiesOnPage = new List<BoardActivity>();
            if (page > 0 && amountObjectsPerPage > 0)
            {
                using (var dbContext = await CreateDbContextAsync(cancellationToken))
                {
                    if ((await dbContext.BoardActivities.Where(x => x.BoardId == id).CountAsync()) > 0)
                    {
                        activitiesOnPage.AddRange(await dbContext.BoardActivities
                        .Where(x => x.BoardId == id)
                        .OrderByDescending(x => x.ActivityTime)
                        .Skip((page - 1) * amountObjectsPerPage)
                        .Take(amountObjectsPerPage)
                        .AsNoTracking()
                        .ToListAsync(cancellationToken));
                    }
                }
            }
            return activitiesOnPage;
        }
        public async Task<int> GetBoardActivityAmountByBoardIdAsync(string id, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                return await dbContext.BoardActivities.Where(x => x.BoardId == id).CountAsync();
            }
        }
        public async Task<BoardActivity> CreateBoardActivityAsync(BoardActivity boardActivity, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                boardActivity.Id = default!;
                boardActivity.ActivityTime = DateTime.UtcNow;
                await dbContext.AddAsync(boardActivity, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return boardActivity;
            }
        }
    }
}
