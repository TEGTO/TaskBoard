using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public interface IBoardTaskActivityService
    {
        public Task<BoardTaskActivity?> GetTaskActivityByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default);
        public Task<IEnumerable<BoardTaskActivity>> GetTaskActivitiesByTaskIdAsync(string taskId, CancellationToken cancellationToken = default);
        public Task<BoardTaskActivity> CreateTaskBoardActivityAsync(BoardTaskActivity taskActivity, CancellationToken cancellationToken = default);
    }
}