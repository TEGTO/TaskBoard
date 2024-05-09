using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public class UserService(IDbContextFactory<BoardTasksDbContext> contextFactory) : ServiceDBBase(contextFactory), IUserService
    {
        public async Task<User?> GetUserByIdAsync(string id, bool isTrackable = false, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                User? user;
                if (isTrackable)
                {
                    user = await dbContext.Users
                    .Include(x => x.BoardTaskLists).ThenInclude(y => y.BoardTasks).FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
                }
                else
                {
                    user = await dbContext.Users.AsNoTracking()
                    .Include(x => x.BoardTaskLists).ThenInclude(y => y.BoardTasks).FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
                }
                return user;
            }
        }
        public async Task<User> CreateNewUserAsync(User user, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                user.Id = default!;
                await dbContext.AddAsync(user, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return user;
            }
        }
    }
}