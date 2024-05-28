using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public interface IBoardService
    {
        public Task<Board?> GetBoardByIdAsync(string id, CancellationToken cancellationToken = default);
        public Task<IEnumerable<Board>> GetBoardsByUserIdAsync(string userId, CancellationToken cancellationToken = default);
        public Task<int> GetTaskListsAmountAsync(string id, CancellationToken cancellationToken);
        public Task<int> GetTasksAmountAsync(string id, CancellationToken cancellationToken);
        public Task<Board> CreateBoardAsync(Board board, CancellationToken cancellationToken = default);
        public Task UpdateBoardAsync(Board board, CancellationToken cancellationToken = default);
        public Task DeleteBoardAsync(string id, CancellationToken cancellationToken = default);
    }
}
