using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public interface IBoardActivityService
    {
        public Task<BoardActivity?> GetActivityByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default);
        public Task<IEnumerable<BoardActivity>> GetActivitiesOnPageByBoardIdAsync(string id, int page, int amountObjectsPerPage, CancellationToken cancellationToken = default);
        public Task<BoardActivity> CreateBoardActivityAsync(BoardActivity boardActivity, CancellationToken cancellationToken = default);
        public Task<int> GetBoardActivityAmountByBoardIdAsync(string id, CancellationToken cancellationToken = default);
    }
}