using Moq;
using TaskBoardAPI.Models;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Services
{
    [TestFixture]
    internal class BoardTaskListServiceTests : BaseServiceTests<BoardTaskListService>
    {
        protected Mock<IBoardTaskService> mockBoardTaskService;

        protected override BoardTaskListService CreateService()
        {
            return new BoardTaskListService(
                mockDbContextFactory.Object,
                CreateTaskService());
        }
        private IBoardTaskService CreateTaskService()
        {
            mockBoardTaskService = mockRepository.Create<IBoardTaskService>();
            mockBoardTaskService.Setup(x => x.GetTasksByListIdAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((string listId, CancellationToken cancellationToken) =>
            {
                return testBoardTaskLists.FirstOrDefault(list => list.Id == listId)?.BoardTasks ?? new List<BoardTask>();
            });
            return mockBoardTaskService.Object;
        }

        [Test]
        public async Task GetTaskListByIdAsync_ValidId_ValidResult()
        {
            // Arrange
            var service = CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskListByIdAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result.Id, Is.EqualTo("1"));
            Assert.That(result.UserId, Is.EqualTo("1"));
            Assert.That(result.CreationTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.Name, Is.EqualTo("List1"));
            Assert.That(result.BoardTasks.Count(), Is.EqualTo(1));
            Assert.That(result.BoardTasks.First().Name, Is.EqualTo("Task1"));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync("1", cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListByIdAsync_InvalidId_NullResult()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskListByIdAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Null);
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync("1", cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListsByUserIdAsync_ValidId_ValidTwoLists()
        {
            // Arrange
            var service = CreateService();
            string userId = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskListsByUserIdAsync(
                userId,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(2));
            Assert.That(result.First().Id, Is.EqualTo("1"));
            Assert.That(result.First().UserId, Is.EqualTo("1"));
            Assert.That(result.First().CreationTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.First().Name, Is.EqualTo("List1"));
            Assert.That(result.First().BoardTasks.Count(), Is.EqualTo(1));
            Assert.That(result.First().BoardTasks.First().Name, Is.EqualTo("Task1"));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync(It.IsAny<string>(), cancellationToken), Times.Exactly(2));
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListsByUserIdAsync_InvalidId_EmptyList()
        {
            // Arrange
            var service = CreateService();
            string userId = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskListsByUserIdAsync(
                userId,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(0));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync(It.IsAny<string>(), cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateTaskListAsync_ValidListTask_SameListTaskWithNewIdAndCreationTime()
        {
            // Arrange
            var service = CreateService();
            BoardTaskList taskList = new BoardTaskList
            {
                Id = "oldId",
                UserId = "1",
                CreationTime = DateTime.MinValue,
                Name = "List4",
                BoardTasks =
                new List<BoardTask> { new BoardTask {
                    Id = "oldId",
                    BoardTaskListId = "oldId",
                    CreationTime = DateTime.MinValue,
                    Name = "Task4",
                    DueTime = DateTime.MinValue,
                    Description = "description",
                    Priority = Priority.Low } }
            };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.CreateTaskListAsync(
                taskList,
                cancellationToken);
            // Assert
            Assert.That(result.Id, Is.Not.EqualTo("oldId"));
            Assert.That(result.UserId, Is.EqualTo("1"));
            Assert.That(result.CreationTime, Is.Not.EqualTo(DateTime.MinValue));
            Assert.That(result.Name, Is.EqualTo("List4"));
            Assert.That(result.BoardTasks.Count(), Is.EqualTo(1));
            Assert.That(result.BoardTasks.First().Name, Is.EqualTo("Task4"));
            Assert.That(result.BoardTasks.First().BoardTaskListId, Is.EqualTo("oldId"));
            Assert.That(testBoardTaskLists.Count(), Is.EqualTo(4));
            Assert.That(testBoardTaskLists.Last().Name, Is.EqualTo("List4"));
            mockDbContext.Verify(x => x.AddAsync(taskList, cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public void CreateTaskListAsync_InvalidListTask_ThrowsException()
        {
            // Arrange
            var service = CreateService();
            BoardTaskList nullList = null, invalidList = new BoardTaskList { UserId = "100" };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act and Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.CreateTaskListAsync(nullList, cancellationToken);
            });
            Assert.ThrowsAsync<InvalidDataException>(async () =>
            {
                await service.CreateTaskListAsync(invalidList, cancellationToken);
            });
            mockDbContext.Verify(x => x.AddAsync(nullList, cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task DeleteTaskListAsync_ValidId_DeletesList()
        {
            // Arrange
            var service = CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.DeleteTaskListAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(testBoardTaskLists.Count(), Is.EqualTo(2));
            Assert.That(testBoardTaskLists.FirstOrDefault(x => x.Id == "1"), Is.Null);
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync(id, cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Remove(It.IsAny<BoardTaskList>()), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task DeleteTaskListAsync_InvalidId_WontDelete()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.DeleteTaskListAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(testBoardTaskLists.Count(), Is.EqualTo(3));
            Assert.That(testBoardTaskLists.First(x => x.Id == "1"), Is.Not.Null);
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync(id, cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Remove(It.IsAny<BoardTaskList>()), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task UpdateTaskListAsync_ValidData_UpdatesList()
        {
            // Arrange
            var service = CreateService();
            BoardTaskList taskList = new BoardTaskList
            {
                Id = "1",
                UserId = "10",
                CreationTime = DateTime.MaxValue,
                Name = "NewList",
                BoardTasks = null
            };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act + Assert
            BoardTaskList? taskListInDb = await service.GetTaskListByIdAsync("1", cancellationToken);
            Assert.That(taskListInDb.Id, Is.EqualTo("1"));
            Assert.That(taskListInDb.UserId, Is.Not.EqualTo("10"));
            Assert.That(taskListInDb.CreationTime, Is.Not.EqualTo(DateTime.MaxValue));
            Assert.That(taskListInDb.Name, Is.Not.EqualTo("NewList"));
            Assert.That(taskListInDb.BoardTasks.Count(), Is.EqualTo(1));
            await service.UpdateTaskListAsync(
                taskList,
                cancellationToken);

            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(2));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync("1", cancellationToken), Times.Exactly(2));
            mockDbContext.Verify(x => x.Update(It.IsAny<BoardTaskList>()), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(3));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(3));

            taskListInDb = await service.GetTaskListByIdAsync("1", cancellationToken);
            Assert.That(taskListInDb.Id, Is.EqualTo("1"));
            Assert.That(taskListInDb.UserId, Is.EqualTo("10"));
            Assert.That(taskListInDb.CreationTime, Is.EqualTo(DateTime.MaxValue));
            Assert.That(taskListInDb.Name, Is.EqualTo("NewList"));
            Assert.That(taskListInDb.BoardTasks.Count(), Is.EqualTo(1)); // Won't change
        }
        [Test]
        public void UpdateTaskListAsync_NullData_ThrowsException()
        {
            // Arrange
            var service = CreateService();
            BoardTaskList taskList = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act + Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.UpdateTaskListAsync(taskList, cancellationToken);
            });
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Never());
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync("1", cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Update(It.IsAny<BoardTaskList>()), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Never());
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Never());
        }
        [Test]
        public async Task UpdateTaskListAsync_ListNotExists_WontUpdateList()
        {
            // Arrange
            var service = CreateService();
            BoardTaskList taskList = new BoardTaskList
            {
                Id = "100",
                UserId = "10",
                CreationTime = DateTime.MaxValue,
                Name = "NewList",
                BoardTasks = null
            };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.UpdateTaskListAsync(
                taskList,
                cancellationToken);
            // Assert
            mockDbContext.Verify(x => x.BoardTaskLists, Times.Exactly(1));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync("1", cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Update(It.IsAny<BoardTaskList>()), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));

            BoardTaskList? taskListInDb = await service.GetTaskListByIdAsync("1", cancellationToken);
            Assert.That(taskListInDb.Id, Is.EqualTo("1"));
            Assert.That(taskListInDb.UserId, Is.EqualTo("1"));
            Assert.That(taskListInDb.CreationTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(taskListInDb.Name, Is.EqualTo("List1"));
            Assert.That(taskListInDb.BoardTasks.Count(), Is.EqualTo(1));
        }
    }
}
