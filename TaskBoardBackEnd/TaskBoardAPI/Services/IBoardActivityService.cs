﻿using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public interface IBoardActivityService
    {
        public Task<BoardActivity?> GetActivityByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default);
        public Task<IEnumerable<BoardActivity>> GetActivitiesOnPageByUserIdAsync(string userId, int page, int amountObjectsPerPage, CancellationToken cancellationToken = default);
        public Task<BoardActivity> CreateBoardActivityAsync(BoardActivity boardActivity, CancellationToken cancellationToken = default);
        public Task<int> GetBoardActivityAmountByUserIdAsync(string userId, CancellationToken cancellationToken = default);
    }
}