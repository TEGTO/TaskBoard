using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public interface IUserService
    {
        public Task<User?> GetUserByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default);
        public Task<User> CreateNewUserAsync(User user, CancellationToken cancellationToken = default);
    }
}
