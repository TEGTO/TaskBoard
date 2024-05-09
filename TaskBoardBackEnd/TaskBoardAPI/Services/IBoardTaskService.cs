using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public interface IBoardTaskService
    {
        public Task<BoardTask?> GetTaskByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default);
        public Task<IEnumerable<BoardTask>> GetTasksByListIdAsync(string listId, CancellationToken cancellationToken = default);
        public Task<BoardTask> CreateTaskAsync(BoardTask task, CancellationToken cancellationToken = default);
        public Task UpdateTaskAsync(BoardTask task, CancellationToken cancellationToken = default);
        public Task DeleteTaskAsync(string id, CancellationToken cancellationToken = default);
    }
}