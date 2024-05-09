using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public class BoardTaskListService(IDbContextFactory<BoardTasksDbContext> contextFactory) : ServiceDBBase(contextFactory), IBoardTaskListService
    {
        public async Task<BoardTaskList?> GetTaskListByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTaskList? boardTaskList;
                if (isTrackable)
                {
                    boardTaskList = await dbContext.BoardTaskLists.Include(x => x.BoardTasks)
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                }
                else
                {
                    boardTaskList = await dbContext.BoardTaskLists.AsNoTracking().Include(x => x.BoardTasks)
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                }
                return boardTaskList;
            }
        }
        public async Task<IEnumerable<BoardTaskList>> GetTaskListsByUserIdAsync(string userId, CancellationToken cancellationToken = default)
        {
            List<BoardTaskList> boardTaskLists = new List<BoardTaskList>();
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                boardTaskLists.AddRange(dbContext.BoardTaskLists
                  .Where(x => x.UserId == userId)
                   .OrderBy(x => x.CreationTime.Date).ThenBy(c => c.CreationTime.TimeOfDay)
                  .Include(x => x.BoardTasks.OrderByDescending(bt => bt.CreationTime.Date).ThenByDescending(c => c.CreationTime.TimeOfDay))
                  .AsNoTracking());
            }
            return boardTaskLists;
        }
        public async Task<BoardTaskList> CreateTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                taskList.Id = default!;
                taskList.CreationTime = DateTime.UtcNow;
                await dbContext.AddAsync(taskList, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return taskList;
            }
        }
        public async Task DeleteTaskListAsync(string id, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTaskList? taskListInDb = await GetTaskListByIdAsync(id, cancellationToken: cancellationToken);
                if (taskListInDb != null)
                {
                    dbContext.Remove(taskListInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
        public async Task UpdateTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTaskList? taskListInDb = await GetTaskListByIdAsync(taskList.Id, true, cancellationToken: cancellationToken);
                if (taskListInDb != null)
                {
                    taskListInDb.CopyOther(taskList);
                    dbContext.Update(taskListInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
    }
}
