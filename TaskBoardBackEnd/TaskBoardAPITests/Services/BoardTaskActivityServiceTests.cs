using Moq;
using TaskBoardAPI.Models;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Services
{
    [TestFixture]
    internal class BoardTaskActivityServiceTests : BaseServiceTests<BoardTaskActivityService>
    {
        protected override BoardTaskActivityService CreateService()
        {
            return new BoardTaskActivityService(
                this.mockDbContextFactory.Object);
        }
        [Test]
        public async Task GetTaskActivityByIdAsync_ValidId_ValidResult()
        {
            // Arrange
            var service = this.CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskActivityByIdAsync(
                id,
                false,
                cancellationToken);
            var resultTrackable = await service.GetTaskActivityByIdAsync(
              id,
              true,
              cancellationToken);
            // Assert
            Assert.That(result.Id, Is.EqualTo("1"));
            Assert.That(result.BoardTaskId, Is.EqualTo("1"));
            Assert.That(result.ActivityTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.Description, Is.EqualTo("Activity1"));

            Assert.That(resultTrackable.Id, Is.EqualTo("1"));
            Assert.That(resultTrackable.BoardTaskId, Is.EqualTo("1"));
            Assert.That(resultTrackable.ActivityTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(resultTrackable.Description, Is.EqualTo("Activity1"));

            mockDbContext.Verify(x => x.BoardTaskActivities, Times.Exactly(2));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task GetTaskActivityByIdAsync_InvalidId_NullResult()
        {
            // Arrange
            var service = this.CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskActivityByIdAsync(
                id,
                false,
                cancellationToken);
            var result_trackable = await service.GetTaskActivityByIdAsync(
              id,
              true,
              cancellationToken);
            // Assert
            Assert.That(result, Is.Null);
            Assert.That(result_trackable, Is.Null);
            mockDbContext.Verify(x => x.BoardTaskActivities, Times.Exactly(2));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task GetTaskActivitiesByTaskIdAsync_ValidId_GetAllTaskActivities()
        {
            // Arrange
            var service = this.CreateService();
            string taskId = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskActivitiesByTaskIdAsync(
                taskId,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(3));
            Assert.That(result.First().Id, Is.EqualTo("1"));
            Assert.That(result.First().Description, Is.EqualTo("Activity1"));
            mockDbContext.Verify(x => x.BoardTaskActivities, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskActivitiesByTaskIdAsync_InvalidId_GetEmptyList()
        {
            // Arrange
            var service = this.CreateService();
            string taskId = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetTaskActivitiesByTaskIdAsync(
                taskId,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(0));
            mockDbContext.Verify(x => x.BoardTaskActivities, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateTaskBoardActivityAsync_ValidActivity_SameActivityWithNewTimeAndId()
        {
            // Arrange
            var service = this.CreateService();
            BoardTaskActivity taskActivity = new BoardTaskActivity() { Id = "oldId", BoardTaskId = "1", ActivityTime = DateTime.MinValue, Description = "NewTaskActivity" };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.CreateTaskBoardActivityAsync(
                taskActivity,
                cancellationToken);
            // Assert
            Assert.That(result, Is.SameAs(taskActivity));
            Assert.That(result.Id, Is.Not.EqualTo("oldId"));
            Assert.That(result.ActivityTime, Is.Not.EqualTo(DateTime.MinValue));
            Assert.That(result.BoardTaskId, Is.EqualTo("1"));
            Assert.That(result.Description, Is.EqualTo("NewTaskActivity"));
            Assert.That(testBoardTaskActivities.Count(), Is.EqualTo(4));
            Assert.That(testBoardTaskActivities.Last().Description, Is.EqualTo("NewTaskActivity"));
            mockDbContext.Verify(x => x.AddAsync(taskActivity, cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public void CreateTaskBoardActivityAsync_InvalidActivity_ThrowsException()
        {
            // Arrange
            var service = this.CreateService();
            BoardTaskActivity nullTaskActivity = null, invalidActivity = new BoardTaskActivity { BoardTaskId = "100" };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act and Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.CreateTaskBoardActivityAsync(nullTaskActivity, cancellationToken);
            });
            Assert.ThrowsAsync<InvalidDataException>(async () =>
            {
                await service.CreateTaskBoardActivityAsync(invalidActivity, cancellationToken);
            });
            mockDbContext.Verify(x => x.AddAsync(nullTaskActivity, cancellationToken), Times.Never);
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never);
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
    }
}
