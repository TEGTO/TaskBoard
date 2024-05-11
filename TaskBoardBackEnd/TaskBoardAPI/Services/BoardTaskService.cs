using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public class BoardTaskService(IDbContextFactory<BoardTasksDbContext> contextFactory) : ServiceDBBase(contextFactory), IBoardTaskService
    {
        public async Task<BoardTask?> GetTaskByIdAsync(string id, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? boardTask = await dbContext.BoardTasks.AsNoTracking()
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                return boardTask;
            }
        }
        public async Task<IEnumerable<BoardTask>> GetTasksByListIdAsync(string listId, CancellationToken cancellationToken = default)
        {
            List<BoardTask> boardTasks = new List<BoardTask>();
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                var headTask = dbContext.BoardTasks.FirstOrDefault(x => x.PrevTaskId == null && x.BoardTaskListId == listId);
                while (headTask != null)
                {
                    boardTasks.Add(headTask);
                    headTask = dbContext.BoardTasks.FirstOrDefault(x => x.Id == headTask.NextTaskId);
                }
            }
            return boardTasks;
        }
        public async Task<BoardTask> CreateTaskAsync(BoardTask task, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                task.Id = default!;
                task.CreationTime = DateTime.UtcNow;
                await dbContext.AddAsync(task, cancellationToken);
                await AddNewHeadTask(task, dbContext, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return task;
            }
        }
        public async Task DeleteTaskAsync(string id, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? taskInDb = await GetTaskByIdAsync(id, cancellationToken: cancellationToken);
                if (taskInDb != null)
                {
                    BoardTask? prevTask = await GetPrevTaskFromDb(taskInDb, dbContext, cancellationToken);
                    BoardTask? nextTask = await GetNextTaskFromDb(taskInDb, dbContext, cancellationToken);
                    UpdateOldSiblings(taskInDb, prevTask, nextTask);
                    dbContext.Remove(taskInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
        public async Task UpdateTaskAsync(BoardTask task, int positionIndex, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? taskInDb = await GetTaskByIdAsync(task.Id, cancellationToken: cancellationToken);
                if (taskInDb != null)
                {
                    if (CheckIfPositionNeedUpdate(task, taskInDb))
                        await UpdateTaskPosition(task, taskInDb, positionIndex, cancellationToken);
                    taskInDb.CopyOther(task);
                    dbContext.Update(taskInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
        private async Task UpdateTaskPosition(BoardTask task, BoardTask taskInDb, int positionIndex, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? oldPrevTask = await GetPrevTaskFromDb(taskInDb, dbContext, cancellationToken);
                BoardTask? oldNextTask = await GetNextTaskFromDb(taskInDb, dbContext, cancellationToken);
                UpdateOldSiblings(task, oldPrevTask, oldNextTask);
                dbContext.SaveChanges();
            }
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? nextTask = GetSiblingFromDbOnPosition(task, positionIndex, dbContext);
                BoardTask? prevTask = GetSiblingFromDbOnPosition(task, positionIndex - 1, dbContext);
                UpdateCurrentSiblings(task, prevTask, nextTask);
                dbContext.SaveChanges();
            }
        }
        private async Task<BoardTask?> GetPrevTaskFromDb(BoardTask task, BoardTasksDbContext dbContext, CancellationToken cancellationToken = default)
        {
            return await dbContext.BoardTasks
               .FirstOrDefaultAsync(x => x.Id == task.PrevTaskId, cancellationToken);
        }
        private async Task<BoardTask?> GetNextTaskFromDb(BoardTask task, BoardTasksDbContext dbContext, CancellationToken cancellationToken = default)
        {
            return await dbContext.BoardTasks
                .FirstOrDefaultAsync(x => x.Id == task.NextTaskId, cancellationToken);
        }
        private BoardTask? GetSiblingFromDbOnPosition(BoardTask task, int positionIndex, BoardTasksDbContext dbContext)
        {
            if (positionIndex < 0) return null;
            var headTask = dbContext.BoardTasks.FirstOrDefault(x => x.Id != task.Id && x.PrevTaskId == null && x.BoardTaskListId == task.BoardTaskListId);
            int index = 0;
            while (headTask != null && index != positionIndex)
            {
                headTask = dbContext.BoardTasks.FirstOrDefault(x => x.Id == headTask.NextTaskId);
                index++;
            }
            return headTask;
        }
        private async Task AddNewHeadTask(BoardTask task, BoardTasksDbContext dbContext, CancellationToken cancellationToken = default)
        {
            BoardTask? headTask = await dbContext.BoardTasks
                .Where(x => x.BoardTaskListId == task.BoardTaskListId)
                .FirstOrDefaultAsync(x => x.PrevTaskId == null, cancellationToken) ?? null;
            UpdateCurrentSiblings(task, null, headTask);
        }
        private void UpdateCurrentSiblings(BoardTask task, BoardTask? prevTask, BoardTask? nextTask)
        {
            task.PrevTaskId = null;
            task.NextTaskId = null;
            if (prevTask != null)
            {
                prevTask.NextTaskId = task.Id;
                task.PrevTaskId = prevTask.Id;
            }
            if (nextTask != null)
            {
                nextTask.PrevTaskId = task.Id;
                task.NextTaskId = nextTask.Id;
            }
        }
        private void UpdateOldSiblings(BoardTask task, BoardTask? prevTask, BoardTask? nextTask)
        {
            if (prevTask != null)
                prevTask.NextTaskId = nextTask == null ? null : nextTask.Id;
            if (nextTask != null)
                nextTask.PrevTaskId = prevTask == null ? null : prevTask.Id;
            task.NextTaskId = null;
            task.PrevTaskId = null;
        }
        private bool CheckIfPositionNeedUpdate(BoardTask boardTask, BoardTask boardTaskInDb)
        {
            if (boardTask.BoardTaskListId != boardTaskInDb.BoardTaskListId) return true;
            else if (boardTask.PrevTaskId != boardTaskInDb.PrevTaskId) return true;
            else if (boardTask.NextTaskId != boardTaskInDb.NextTaskId) return true;
            return false;
        }
    }
}
