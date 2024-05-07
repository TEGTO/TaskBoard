using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public interface IBoardTaskListService
    {
        public Task<BoardTaskList?> GetTaskListByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default);
        public Task<BoardTaskList> CreateTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default);
        public Task DeleteTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default);
        public Task UpdateTaskListAsync(BoardTaskList taskList, CancellationToken cancellationToken = default);
    }
}