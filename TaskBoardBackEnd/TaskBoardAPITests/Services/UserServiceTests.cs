using Moq;
using System.Threading.Tasks;
using TaskBoardAPI.Models;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Services
{
    [TestFixture]
    internal class UserServiceTests : BaseServiceTests<UserService>
    {
        protected override UserService CreateService()
        {
            return new UserService(
                this.mockDbContextFactory.Object);
        }
        [Test]
        public async Task GetUserByIdAsync_ValidId_ValidResult()
        {
            // Arrange
            var service = this.CreateService();
            string id = "1";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetUserByIdAsync(
                id,
                false,
                cancellationToken);
            var resultTrackable = await service.GetUserByIdAsync(
               id,
               true,
               cancellationToken);
            // Assert
            Assert.That(result.Id, Is.EqualTo("1"));
            Assert.That(resultTrackable.Id, Is.EqualTo("1"));
            mockDbContext.Verify(x => x.Users, Times.Exactly(2));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task GetUserByIdAsync_InvalidId_NullResult()
        {
            // Arrange
            var service = this.CreateService();
            string id = "100";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.GetUserByIdAsync(
                id,
                false,
                cancellationToken);
            var resultTrackable = await service.GetUserByIdAsync(
               id,
               true,
               cancellationToken);
            // Assert
            Assert.That(result, Is.Null);
            Assert.That(resultTrackable, Is.Null);
            mockDbContext.Verify(x => x.Users, Times.Exactly(2));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(2));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(2));
        }
        [Test]
        public async Task CreateNewUserAsync_ValidUser_AddedNewUserWithNewId()
        {
            // Arrange
            var service = this.CreateService();
            User user = new User {Id = "oldID", BoardTaskLists = new List<BoardTaskList> { new BoardTaskList { Name = "NewTaskList" } } };
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await service.CreateNewUserAsync(
                user,
                cancellationToken);
            // Assert
            Assert.That(testUsers.Count(), Is.EqualTo(3));
            Assert.That(testUsers.Last().Id, Is.Not.EqualTo("oldID"));
            Assert.That(testUsers.Last().BoardTaskLists.First().Name, Is.EqualTo("NewTaskList"));
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.AddAsync(user, cancellationToken), Times.Exactly(1));
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
        [Test]
        public void CreateNewUserAsync_NullUser_ThrowsException()
        {
            // Arrange
            var service = this.CreateService();
            User user = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act + Assert
            Assert.ThrowsAsync<NullReferenceException>(async () =>
            {
                await service.CreateNewUserAsync(user, cancellationToken);
            });
            mockDbContext.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.AddAsync(user, cancellationToken), Times.Never());
            mockDbContext.Verify(x => x.Dispose(), Times.Exactly(1));
            mockDbContextFactory.Verify(x => x.CreateDbContextAsync(cancellationToken), Times.Exactly(1));
        }
    }
}