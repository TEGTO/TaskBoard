using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public class BoardTaskListService(IDbContextFactory<BoardTasksDbContext> contextFactory, IBoardTaskService boardTaskService) : ServiceDBBase(contextFactory), IBoardTaskListService
    {
        public async Task<BoardTaskList?> GetTaskListByIdAsync(string id, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTaskList? boardTaskList = await dbContext.BoardTaskLists.AsNoTracking()
                 .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                if (boardTaskList != null)
                    boardTaskList.BoardTasks = (await boardTaskService.GetTasksByListIdAsync(boardTaskList.Id)).ToList();
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
                  .AsNoTracking());
                await Task.WhenAll(boardTaskLists.Select(async list =>
                {
                    list.BoardTasks = (await boardTaskService.GetTasksByListIdAsync(list.Id)).ToList();
                }));
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
            BoardTaskList? taskListInDb = await GetTaskListByIdAsync(id, cancellationToken: cancellationToken);
            if (taskListInDb != null)
            {
                using (var dbContext = await CreateDbContextAsync(cancellationToken))
                {

                    dbContext.Remove(taskListInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
        public async Task UpdateTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default)
        {
            BoardTaskList? taskListInDb = await GetTaskListByIdAsync(taskList.Id, cancellationToken: cancellationToken);
            if (taskListInDb != null)
            {
                using (var dbContext = await CreateDbContextAsync(cancellationToken))
                {

                    taskListInDb.CopyOther(taskList);
                    dbContext.Update(taskListInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
    }
}
