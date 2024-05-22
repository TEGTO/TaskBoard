using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public interface IBoardTaskListService
    {
        public Task<BoardTaskList?> GetTaskListByIdAsync(string id, CancellationToken cancellationToken = default);
        public Task<IEnumerable<BoardTaskList>> GetTaskListsByBoardIdAsync(string id, CancellationToken cancellationToken = default);
        public Task<BoardTaskList> CreateTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default);
        public Task UpdateTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default);
        public Task DeleteTaskListAsync(string id, CancellationToken cancellationToken = default);
    }
}