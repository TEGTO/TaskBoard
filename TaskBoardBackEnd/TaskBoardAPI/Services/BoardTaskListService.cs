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
        public async Task<BoardTaskList> CreateTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                taskList.CreationTime = DateTime.UtcNow;
                await dbContext.AddAsync(taskList, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return taskList;
            }
        }
        public async Task DeleteTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTaskList? taskListInDb = await GetTaskListByIdAsync(taskList.Id, cancellationToken: cancellationToken);
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
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
    }
}
