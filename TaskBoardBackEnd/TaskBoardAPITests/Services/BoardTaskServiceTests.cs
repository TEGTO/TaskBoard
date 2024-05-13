using Moq;
using TaskBoardAPI.Models;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Services
{
    [TestFixture]
    internal class BoardTaskServiceTests : BaseServiceTests<BoardTaskService>
    {
        protected override BoardTaskService CreateService()
        {
            return new BoardTaskService(
               mockDbContextFactory.Object);
        }
        [Test]
        public async Task GetTaskByIdAsync_ValidId_ValidResult()
        {
            // Arrange
            var service = CreateService();
            string id = "3";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskByIdAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result.Id, Is.EqualTo("3"));
            Assert.That(result.BoardTaskListId, Is.EqualTo("3"));
            Assert.That(result.CreationTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.DueTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.Name, Is.EqualTo("Task3"));
            Assert.That(result.Description, Is.EqualTo("description"));
            Assert.That(result.Priority, Is.EqualTo(Priority.Low));
            Assert.That(result.PrevTaskId, Is.Null);
            Assert.That(result.NextTaskId, Is.EqualTo("4"));
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskByIdAsync_InvalidId_NullResult()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskByIdAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Null);
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTasksByListIdAsync_ValidId_ValidTwoTasks()
        {
            // Arrange
            var service = CreateService();
            string listId = "3";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTasksByListIdAsync(
                listId,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(2));
            Assert.That(result.First().Id, Is.EqualTo("3"));
            Assert.That(result.First().BoardTaskListId, Is.EqualTo("3"));
            Assert.That(result.First().CreationTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.First().Name, Is.EqualTo("Task3"));
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(3));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTasksByListIdAsync_InvalidId_EmptyList()
        {
            // Arrange
            var service = CreateService();
            string listId = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTasksByListIdAsync(
                listId,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(0));
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateTaskAsync_ValidTask_SameAddedTaskWithUpdatedIdAndCreationDate()
        {
            // Arrange
            var service = CreateService();
            BoardTask task = new BoardTask
            {
                Id = "5",
                BoardTaskListId = "3",
                CreationTime = DateTime.MaxValue,
                Name = "Task5",
                DueTime = DateTime.MaxValue,
                Description = "description",
                Priority = Priority.Low,
                PrevTaskId = "SomeIndex"
            };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.CreateTaskAsync(
                task,
                cancellationToken);
            // Assert
            Assert.That(result.Id, Is.Not.EqualTo("oldId"));
            Assert.That(result.BoardTaskListId, Is.EqualTo("3"));
            Assert.That(result.CreationTime, Is.Not.EqualTo(DateTime.MaxValue));
            Assert.That(result.Name, Is.EqualTo("Task5"));
            Assert.That(result.DueTime, Is.EqualTo(DateTime.MaxValue));
            Assert.That(result.Description, Is.EqualTo("description"));
            Assert.That(result.Priority, Is.EqualTo(Priority.Low));
            Assert.That(result.PrevTaskId, Is.Null);
            Assert.That(testBoardTasks.Count(), Is.EqualTo(5));
            Assert.That(testBoardTasks.Last().Name, Is.EqualTo("Task5"));
            mockDbContext.Verify(x => x.AddAsync(task, cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public void CreateTaskAsync_InvalidTask_ThrowsError()
        {
            // Arrange
            var service = CreateService();
            BoardTask nullTask = null, invalidTask = new BoardTask
            {
                Id = "5",
                BoardTaskListId = "100"
            };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act + Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.CreateTaskAsync(nullTask, cancellationToken);
            });
            Assert.ThrowsAsync<InvalidDataException>(async () =>
            {
                await service.CreateTaskAsync(invalidTask, cancellationToken);
            });
            Assert.That(testBoardTasks.Count(), Is.EqualTo(4));
            mockDbContext.Verify(x => x.AddAsync(nullTask, cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.BoardTasks, Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task DeleteTaskAsync_ValidId_DeletesTask()
        {
            // Arrange
            var service = CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.DeleteTaskAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(testBoardTasks.Count(), Is.EqualTo(3));
            Assert.That(testBoardTasks.FirstOrDefault(x => x.Id == "1"), Is.Null);
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Remove(It.IsAny<BoardTask>()), Times.Exactly(1));
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(3));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task DeleteTaskAsync_InvalidId_WontDeletek()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.DeleteTaskAsync(
                id,
                cancellationToken);
            // Assert
            Assert.That(testBoardTasks.Count(), Is.EqualTo(4));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Remove(It.IsAny<BoardTask>()), Times.Never());
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task UpdateTaskAsync_ValidData_UpdatesListTask()
        {
            // Arrange
            var service = CreateService();
            BoardTask task = new BoardTask { Id = "4", BoardTaskListId = "1" };
            int positionIndex = 0;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.UpdateTaskAsync(
                task,
                positionIndex,
                cancellationToken);
            // Assert
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Update(It.IsAny<BoardTask>()), Times.Exactly(1));
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(4));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(4));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(4));

            BoardTask boardTask = await service.GetTaskByIdAsync("4", cancellationToken);
            Assert.That(boardTask.Id, Is.EqualTo("4"));
            Assert.That(boardTask.BoardTaskListId, Is.EqualTo("1"));
            Assert.That(boardTask.PrevTaskId, Is.Null);
            Assert.That(boardTask.NextTaskId, Is.EqualTo("1"));

            BoardTask prevNextTask = await service.GetTaskByIdAsync("3", cancellationToken);
            Assert.That(prevNextTask.Id, Is.EqualTo("3"));
            Assert.That(prevNextTask.BoardTaskListId, Is.EqualTo("3"));
            Assert.That(prevNextTask.PrevTaskId, Is.Null);
            Assert.That(prevNextTask.NextTaskId, Is.Null);
        }
        [Test]
        public void UpdateTaskAsync_NullData_ThrowsException()
        {
            // Arrange
            var service = CreateService();
            BoardTask task = null;
            int positionIndex = 0;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act + Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.UpdateTaskAsync(task, positionIndex, cancellationToken);
            });
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Update(It.IsAny<BoardTask>()), Times.Never());
            mockDbContext.Verify(x => x.BoardTasks, Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Never());
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Never());
        }
        [Test]
        public async Task UpdateTaskAsync_TaskNotExists_WontUpdateTak()
        {
            // Arrange
            var service = CreateService();
            BoardTask task = new BoardTask { Id = "100" };
            int positionIndex = 0;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            await service.UpdateTaskAsync(
                task,
                positionIndex,
                cancellationToken);
            //Assert
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Update(It.IsAny<BoardTask>()), Times.Never());
            mockDbContext.Verify(x => x.BoardTasks, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
    }
}
