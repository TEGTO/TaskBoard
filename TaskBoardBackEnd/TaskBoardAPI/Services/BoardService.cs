using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Services
{
    public class BoardService(IDbContextFactory<BoardTasksDbContext> contextFactory) : ServiceDBBase(contextFactory), IBoardService
    {
        public async Task<Board?> GetBoardByIdAsync(string id, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                Board? board = await dbContext.Boards.AsNoTracking()
                   .FirstOrDefaultAsync(x => x.Id == id, cancellationToken) ?? null;
                return board;
            }
        }
        public async Task<IEnumerable<Board>> GetBoardsByUserIdAsync(string userId, CancellationToken cancellationToken = default)
        {
            List<Board> boards = new List<Board>();
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                boards.AddRange(dbContext.Boards
                  .Where(x => x.UserId == userId)
                  .OrderBy(x => x.CreationTime)
                  .AsNoTracking());
            }
            return boards;
        }
        public async Task<int> GetTaskListsAmountAsync(string id, CancellationToken cancellationToken)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                return await dbContext.BoardTaskLists.Where(x => x.BoardId == id).CountAsync();
            }
        }
        public async Task<int> GetTasksAmountAsync(string id, CancellationToken cancellationToken)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                return await dbContext.BoardTaskLists
                                      .Where(x => x.BoardId == id)
                                      .SelectMany(x => x.BoardTasks)
                                      .CountAsync(cancellationToken);
            }
        }
        public async Task<Board> CreateBoardAsync(Board board, CancellationToken cancellationToken = default)
        {
            using (var dbContext = await CreateDbContextAsync(cancellationToken))
            {
                board.Id = default!;
                board.CreationTime = DateTime.UtcNow;
                await dbContext.AddAsync(board, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
                return board;
            }
        }
        public async Task UpdateBoardAsync(Board board, CancellationToken cancellationToken = default)
        {
            Board? boardInDb = await GetBoardByIdAsync(board.Id, cancellationToken: cancellationToken);
            if (boardInDb != null)
            {
                using (var dbContext = await CreateDbContextAsync(cancellationToken))
                {

                    boardInDb.CopyOther(board);
                    dbContext.Update(boardInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
        public async Task DeleteBoardAsync(string id, CancellationToken cancellationToken = default)
        {
            Board? boardInDb = await GetBoardByIdAsync(id, cancellationToken: cancellationToken);
            if (boardInDb != null)
            {
                using (var dbContext = await CreateDbContextAsync(cancellationToken))
                {
                    dbContext.Remove(boardInDb);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
    }
}
