using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public class BoardTaskService(IDbContextFactory<BoardTasksDbContext> contextFactory) : ServiceDBBase(contextFactory), IBoardTaskService
    {
        public async Task<BoardTask?> GetTaskByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? boardTask;
                if (isTrackable)
                {
                    boardTask = await dbContext.BoardTasks
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                }
                else
                {
                    boardTask = await dbContext.BoardTasks.AsNoTracking()
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                }
                return boardTask;
            }
        }
        public async Task<BoardTask> CreateTaskAsync(BoardTask task, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                task.CreationTime = DateTime.UtcNow;
                await dbContext.AddAsync(task, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return task;
            }
        }
        public async Task DeleteTaskAsync(BoardTask task, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? taskInDb = await GetTaskByIdAsync(task.Id, cancellationToken: cancellationToken);
                if (taskInDb != null)
                {
                    await RemoveUpdateSiblings(dbContext, taskInDb, cancellationToken);
                    dbContext.Remove(taskInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
        public async Task UpdateTaskAsync(BoardTask task, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? taskInDb = await GetTaskByIdAsync(task.Id, true, cancellationToken: cancellationToken);
                if (taskInDb != null)
                {
                    taskInDb.CopyOther(task);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
        public async Task UpdateTaskPosition(BoardTask task, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                BoardTask? taskInDb = await GetTaskByIdAsync(task.Id, true, cancellationToken: cancellationToken);
                if (taskInDb == null)
                    throw new InvalidDataException("Task does not exist in database!");
                taskInDb.CopyOther(task);
                if (taskInDb.IsHead)
                    await RemoveCurrentHeadTask(dbContext, cancellationToken);
                await InsertUpdateSiblings(dbContext, taskInDb, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
        private async Task RemoveCurrentHeadTask(BoardTasksDbContext dbContext, CancellationToken cancellationToken = default)
        {
            BoardTask? headTask = await dbContext.BoardTasks.FirstOrDefaultAsync(x => x.IsHead, cancellationToken) ?? null;
            if (headTask != null)
                headTask.IsHead = false;
        }
        private async Task InsertUpdateSiblings(BoardTasksDbContext dbContext, BoardTask task, CancellationToken cancellationToken = default)
        {
            BoardTask? prevTask = await dbContext.BoardTasks.FirstOrDefaultAsync(x => x.Id == task.PrevTaskId, cancellationToken) ?? null;
            BoardTask? nextTask = await dbContext.BoardTasks.FirstOrDefaultAsync(x => x.Id == task.NextTaskId, cancellationToken) ?? null;
            if (prevTask != null)
                prevTask.NextTaskId = task.Id;
            if (nextTask != null)
                nextTask.PrevTaskId = task.Id;
        }
        private async Task RemoveUpdateSiblings(BoardTasksDbContext dbContext, BoardTask task, CancellationToken cancellationToken = default)
        {
            BoardTask? prevTask = await dbContext.BoardTasks.FirstOrDefaultAsync(x => x.Id == task.PrevTaskId, cancellationToken) ?? null;
            BoardTask? nextTask = await dbContext.BoardTasks.FirstOrDefaultAsync(x => x.Id == task.NextTaskId, cancellationToken) ?? null;
            if (prevTask != null)
                prevTask.NextTaskId = nextTask == null ? null : nextTask.Id;
            if (nextTask != null)
            {
                nextTask.PrevTaskId = prevTask == null ? null : prevTask.Id;
                if (prevTask == null && task.IsHead)
                    nextTask.IsHead = true;
            }
        }
    }
}
