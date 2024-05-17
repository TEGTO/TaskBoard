using Moq;
using TaskBoardAPI.Models;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Services
{
    [TestFixture]
    internal class BoardActivityServiceTests : BaseServiceTests<BoardActivityService>
    {
        protected override BoardActivityService CreateService()
        {
            return new BoardActivityService(
                mockDbContextFactory.Object);
        }
        [Test]
        public async Task GetActivityByIdAsync_ValidId_ValidResult()
        {
            // Arrange
            var service = CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetActivityByIdAsync(
                id,
                false,
                cancellationToken);
            var resultTrackable = await service.GetActivityByIdAsync(
              id,
              true,
              cancellationToken);
            // Assert
            Assert.That(result.Id, Is.EqualTo("1"));
            Assert.That(result.UserId, Is.EqualTo("1"));
            Assert.That(result.ActivityTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(result.Description, Is.EqualTo("Activity1"));

            Assert.That(resultTrackable.Id, Is.EqualTo("1"));
            Assert.That(resultTrackable.UserId, Is.EqualTo("1"));
            Assert.That(resultTrackable.ActivityTime, Is.EqualTo(DateTime.MinValue));
            Assert.That(resultTrackable.Description, Is.EqualTo("Activity1"));

            mockDbContext.Verify(x => x.BoardActivities, Times.Exactly(2));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task GetActivityByIdAsync_InvalidId_NullResult()
        {
            // Arrange
            var service = CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetActivityByIdAsync(
                id,
                false,
                cancellationToken);
            var result_trackable = await service.GetActivityByIdAsync(
            id,
            true,
            cancellationToken);
            // Assert
            Assert.That(result, Is.Null);
            Assert.That(result_trackable, Is.Null);
            mockDbContext.Verify(x => x.BoardActivities, Times.Exactly(2));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task GetActivitiesOnPageByUserIdAsync_ValidIdSkip2_GetOneValid()
        {
            // Arrange
            var service = CreateService();
            string userId = "1";
            int page = 2;
            int amountObjectsPerPage = 2;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetActivitiesOnPageByUserIdAsync(
                userId,
                page,
                amountObjectsPerPage,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(1));
            Assert.That(result.First().Id, Is.EqualTo("3"));
            Assert.That(result.First().Description, Is.EqualTo("Activity3"));
            mockDbContext.Verify(x => x.BoardActivities, Times.Exactly(2));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetActivitiesOnPageByUserIdAsync_InvalidId_GetZero()
        {
            // Arrange
            var service = CreateService();
            string userId = "100";
            int page = 2;
            int amountObjectsPerPage = 2;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetActivitiesOnPageByUserIdAsync(
                userId,
                page,
                amountObjectsPerPage,
                cancellationToken);
            // Assert
            Assert.That(result.Count(), Is.EqualTo(0));
            mockDbContext.Verify(x => x.BoardActivities, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardActivityAmountByUserIdAsync_ValidId_GetAmountThree()
        {
            // Arrange
            var service = CreateService();
            string userId = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetBoardActivityAmountByUserIdAsync(
                userId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.EqualTo(3));
            mockDbContext.Verify(x => x.BoardActivities, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardActivityAmountByUserIdAsync_InvalidId_GetAmountZero()
        {
            // Arrange
            var service = CreateService();
            string userId = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetBoardActivityAmountByUserIdAsync(
                userId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.EqualTo(0));
            mockDbContext.Verify(x => x.BoardActivities, Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateBoardActivityAsync_ValidActivity_SameAddedActivityWithNewTimeAndId()
        {
            // Arrange
            var service = CreateService();
            BoardActivity boardActivity = new BoardActivity { Id = "oldId", ActivityTime = DateTime.MinValue, Description = "NewActivity", UserId = "1" };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.CreateBoardActivityAsync(
                boardActivity,
                cancellationToken);
            // Assert
            Assert.That(result, Is.SameAs(boardActivity));
            Assert.That(result.Id, Is.Not.EqualTo("oldId"));
            Assert.That(result.ActivityTime, Is.Not.EqualTo(DateTime.MinValue));
            Assert.That(result.Description, Is.EqualTo("NewActivity"));
            Assert.That(result.UserId, Is.EqualTo("1"));
            Assert.That(testBoardActivities.Count(), Is.EqualTo(4));
            Assert.That(testBoardActivities.Last().Description, Is.EqualTo("NewActivity"));
            mockDbContext.Verify(x => x.AddAsync(boardActivity, cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public void CreateBoardActivityAsync_InvalidActivity_ThrowsException()
        {
            // Arrange
            var service = CreateService();
            BoardActivity nullBoardActivity = null,
            invalidBoardActivity = new BoardActivity { UserId = "10" }; 
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act and Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.CreateBoardActivityAsync(nullBoardActivity, cancellationToken);
            });
            Assert.ThrowsAsync<InvalidDataException>(async () =>
            {
                await service.CreateBoardActivityAsync(invalidBoardActivity, cancellationToken);
            });
            mockDbContext.Verify(x => x.AddAsync(nullBoardActivity, cancellationToken), Times.Never);
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never);
            mockDbContext.Verify(x => x.AddAsync(nullBoardActivity, cancellationToken), Times.Exactly(0));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(0));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
    }
}
