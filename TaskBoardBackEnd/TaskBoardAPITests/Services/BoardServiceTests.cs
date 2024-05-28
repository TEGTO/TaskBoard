using Moq;
using TaskBoardAPI.Models;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Services
{
    [TestFixture]
    internal class BoardServiceTests : BaseServiceTests<BoardService>
    {
        protected override BoardService CreateService()
        {
            return new BoardService(mockDbContextFactory.Object);
        }

        [Test]
        public async Task GetBoardByIdAsync_ValidId_ValidResult()
        {
            // Arrange
            var service = CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetBoardByIdAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result.Id, Is.EqualTo("1"));
            Assert.That(result.UserId, Is.EqualTo("1"));
            Assert.That(result.CreationTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.Name, Is.EqualTo("Board1"));
            mockDbContext.Verify(x => x.Boards, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardByIdAsync_InvalidId_NullResult()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetBoardByIdAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Null);
            mockDbContext.Verify(x => x.Boards, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardsByUserIdAsync_ValidId_ValidTwoLists()
        {
            // Arrange
            var service = CreateService();
            string userId = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetBoardsByUserIdAsync(
                userId,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(1));
            Assert.That(result.First().Id, Is.EqualTo("1"));
            Assert.That(result.First().UserId, Is.EqualTo("1"));
            Assert.That(result.First().CreationTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.First().Name, Is.EqualTo("Board1"));
            mockDbContext.Verify(x => x.Boards, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardsByUserIdAsync_InvalidId_EmptyList()
        {
            // Arrange
            var service = CreateService();
            string userId = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetBoardsByUserIdAsync(
                userId,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(0));
            mockDbContext.Verify(x => x.Boards, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListsAmountByBoardIdAsync_ValidId_ValidResult()
        {
            // Arrange
            var service = CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskListsAmountAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.EqualTo(2));
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListsAmountByBoardIdAsync_InvalidId_0Result()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskListsAmountAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.EqualTo(0));
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTasksAmountByBoardIdAsync_ValidId_ValidResult()
        {
            // Arrange
            var service = CreateService();
            string id = "2";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTasksAmountAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.EqualTo(1));
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTasksAmountByBoardIdAsync_InvalidId_0Result()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTasksAmountAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.EqualTo(0));
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateBoardAsync_ValidData_SameDataWithNewIdAndCreationTime()
        {
            // Arrange
            var service = CreateService();
            Board board = new Board
            {
                Id = "oldId",
                UserId = "1",
                CreationTime = DateTime.MinValue,
                Name = "Board3"
            };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.CreateBoardAsync(
                board,
                cancellationToken);
            // Assert
            Assert.That(result.Id, Is.Not.EqualTo("oldId"));
            Assert.That(result.UserId, Is.EqualTo("1"));
            Assert.That(result.CreationTime, Is.Not.EqualTo(DateTime.MinValue));
            Assert.That(result.Name, Is.EqualTo("Board3"));
            Assert.That(testBoards.Count(), Is.EqualTo(3));
            Assert.That(testBoards.Last().Name, Is.EqualTo("Board3"));
            mockDbContext.Verify(x => x.AddAsync(board, cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public void CreateBoardAsync_InvalidData_ThrowsException()
        {
            // Arrange
            var service = CreateService();
            Board nullBoard = null, invalidBoard = new Board { UserId = "100" };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act and Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.CreateBoardAsync(nullBoard, cancellationToken);
            });
            Assert.ThrowsAsync<InvalidDataException>(async () =>
            {
                await service.CreateBoardAsync(invalidBoard, cancellationToken);
            });
            mockDbContext.Verify(x => x.AddAsync(nullBoard, cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task UpdateBoardAsync_ValidData_UpdatesBoard()
        {
            // Arrange
            var service = CreateService();
            Board board = new Board
            {
                Id = "1",
                UserId = "10",
                CreationTime = DateTime.MaxValue,
                Name = "NewBoard"
            };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act + Assert
            Board? boardInDb = await service.GetBoardByIdAsync("1", cancellationToken);
            Assert.That(boardInDb.Id, Is.EqualTo("1"));
            Assert.That(boardInDb.UserId, Is.Not.EqualTo("10"));
            Assert.That(boardInDb.CreationTime, Is.Not.EqualTo(DateTime.MaxValue));
            Assert.That(boardInDb.Name, Is.Not.EqualTo("NewBoard"));
            await service.UpdateBoardAsync(
                board,
                cancellationToken);

            mockDbContext.Verify(x => x.Boards, Times.Exactly(2));
            mockDbContext.Verify(x => x.Update(It.IsAny<Board>()), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(3));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(3));

            boardInDb = await service.GetBoardByIdAsync("1", cancellationToken);
            Assert.That(boardInDb.Id, Is.EqualTo("1"));
            Assert.That(boardInDb.UserId, Is.EqualTo("10"));
            Assert.That(boardInDb.CreationTime, Is.EqualTo(DateTime.MaxValue));
            Assert.That(boardInDb.Name, Is.EqualTo("NewBoard"));
        }
        [Test]
        public void UpdateBoardAsync_NullData_ThrowsException()
        {
            // Arrange
            var service = CreateService();
            Board board = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act + Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.UpdateBoardAsync(board, cancellationToken);
            });
            mockDbContext.Verify(x => x.Boards, Times.Never());
            mockDbContext.Verify(x => x.Update(It.IsAny<Board>()), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Never());
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Never());
        }
        [Test]
        public async Task UpdateBoardAsync_BoardNotExists_WontUpdateBoard()
        {
            // Arrange
            var service = CreateService();
            Board board = new Board
            {
                Id = "100",
                UserId = "10",
                CreationTime = DateTime.MaxValue,
                Name = "NewBoard"
            };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.UpdateBoardAsync(
                board,
                cancellationToken);
            // Assert
            mockDbContext.Verify(x => x.Boards, Times.Exactly(1));
            mockDbContext.Verify(x => x.Update(It.IsAny<Board>()), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));

            Board? boardInDb = await service.GetBoardByIdAsync("1", cancellationToken);
            Assert.That(boardInDb.Id, Is.EqualTo("1"));
            Assert.That(boardInDb.UserId, Is.EqualTo("1"));
            Assert.That(boardInDb.CreationTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(boardInDb.Name, Is.EqualTo("Board1"));
        }
        [Test]
        public async Task DeleteBoardAsync_ValidId_DeletesBoard()
        {
            // Arrange
            var service = CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.DeleteBoardAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(testBoards.Count(), Is.EqualTo(1));
            Assert.That(testBoards.FirstOrDefault(x => x.Id == "1"), Is.Null);
            mockDbContext.Verify(x => x.Boards, Times.Exactly(1));
            mockDbContext.Verify(x => x.Remove(It.IsAny<Board>()), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task DeleteBoardAsync_InvalidId_WontDelete()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.DeleteBoardAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(testBoards.Count(), Is.EqualTo(2));
            Assert.That(testBoards.First(x => x.Id == "1"), Is.Not.Null);
            mockDbContext.Verify(x => x.Boards, Times.Exactly(1));
            mockDbContext.Verify(x => x.Remove(It.IsAny<Board>()), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
    }
}
