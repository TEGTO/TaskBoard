using System.Net;
using TaskBoardAPI.Models;

namespace TaskBoardIntegrationTests.Controllers
{
    [TestFixture]
    internal class BoardControllerTests : BaseContollerTests
    {
        [Test]
        public async Task GetBoardById_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedBoard = testBoards.Find(x => x.Id == id);
            // Act
            var response = await client.GetAsync($"/Board/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain(expectedBoard.Name));
        }
        [Test]
        public async Task GetBoardById_InvalidId_NotFound()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/Board/{id}");
            // Assert
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task GetBoardsByUserId_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedBoards = testBoards.Where(x => x.UserId == id);
            // Act
            var response = await client.GetAsync($"/Board/user/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            foreach (var board in expectedBoards)
            {
                Assert.That(responseString, Does.Contain(board.Name));
            }
        }
        [Test]
        public async Task GetBoardsByUserId_InvalidId_ValidEmptyData()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/Board/user/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain("[]"));
        }
        [Test]
        public async Task GetBoardTaskListsAmountByBoardId_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedAmount = 2;
            // Act
            var response = await client.GetAsync($"/Board/amount/tasklists/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var amount = int.Parse(await response.Content.ReadAsStringAsync());
            Assert.That(amount, Is.EqualTo(expectedAmount));
        }
        [Test]
        public async Task GetBoardTaskListsAmountByBoardId_InvalidId_0Data()
        {
            //Arrange
            string id = "100";
            var expectedAmount = 0;
            // Act
            var response = await client.GetAsync($"/Board/amount/tasklists/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var amount = int.Parse(await response.Content.ReadAsStringAsync());
            Assert.That(amount, Is.EqualTo(expectedAmount));
        }
        [Test]
        public async Task GetBoardTasksAmountByBoardId_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedAmount = 2;
            // Act
            var response = await client.GetAsync($"/Board/amount/tasks/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var amount = int.Parse(await response.Content.ReadAsStringAsync());
            Assert.That(amount, Is.EqualTo(expectedAmount));
        }
        [Test]
        public async Task GetBoardTasksAmountByBoardId_InvalidId_0Data()
        {
            //Arrange
            string id = "100";
            var expectedAmount = 0;
            // Act
            var response = await client.GetAsync($"/Board/amount/tasks/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var amount = int.Parse(await response.Content.ReadAsStringAsync());
            Assert.That(amount, Is.EqualTo(expectedAmount));
        }
        [Test]
        public async Task CreateBoard_ValidData_ValidCreatedData()
        {
            //Arrange
            Board newBoard = new Board() { Id = "OldId", UserId = "1", Name = "NewBoard" };
            int prevAmount = dbContext.Boards.Count();
            // Act
            var response = await client.PostAsJsonAsync($"/Board", newBoard);
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Not.Contain(newBoard.Id));
            Assert.That(responseString, Does.Contain(newBoard.Name));
            int currentAmount = dbContext.Boards.Count();
            Assert.True(currentAmount > prevAmount);
        }
        [Test]
        public async Task CreateBoard_InvalidData_ServerError()
        {
            //Arrange
            Board newBoard1 = null;
            Board newBoard2 = new Board() { Id = "", UserId = "notexists" };
            int prevAmount = dbContext.Boards.Count();
            // Act
            var response1 = await client.PostAsJsonAsync($"/Board", newBoard1);
            var response2 = await client.PostAsJsonAsync($"/Board", newBoard2);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.InternalServerError));
            int currentAmount = dbContext.Boards.Count();
            Assert.True(currentAmount == prevAmount);
        }
        [Test]
        public async Task UpdateBoard_ValidData_OkStatusAndDataIsUpdated()
        {
            //Arrange
            Board board = new Board() { Id = "1", UserId = "1", Name = "NewName" };
            // Act
            var response = await client.PutAsJsonAsync($"/Board", board);
            // Assert
            response.EnsureSuccessStatusCode();
            var response1 = await client.GetAsync($"/Board/{board.Id}");
            var responseString1 = await response1.Content.ReadAsStringAsync();
            Assert.That(responseString1, Does.Contain(board.Id));
            Assert.That(responseString1, Does.Contain(board.UserId));
            Assert.That(responseString1, Does.Contain(board.Name));
        }
        [Test]
        public async Task UpdateBoard_InvalidDataValidationFail_BadRequestStatus()
        {
            //Arrange
            Board badRequestBoard = new Board() { Id = "1" };
            Board nullBoard = null;
            // Act
            var response1 = await client.PutAsJsonAsync($"/Board", badRequestBoard);
            var response2 = await client.PutAsJsonAsync($"/Board", nullBoard);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
        }
        [Test]
        public async Task UpdateBoard_InvalidData_OkStatusAndDataIsNotUpdated()
        {
            //Arrange
            Board board = new Board() { Id = "100", UserId = "3", Name = "NewName" };
            // Act
            var response1 = await client.PutAsJsonAsync($"/Board", board);
            // Assert
            response1.EnsureSuccessStatusCode();
            var response2 = await client.GetAsync($"/Board/{board.Id}");
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task DeleteBoard_ValidData_OkStatusAndDataIsDeleted()
        {
            //Arrange
            string id = "1";
            // Act
            var response1 = await client.DeleteAsync($"/Board/{id}");
            // Assert
            response1.EnsureSuccessStatusCode();
            var response2 = await client.GetAsync($"/Board/{id}");
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task DeleteBoard_InvalidData_OkStatusAndDataIsNotExisted()
        {
            //Arrange
            string id = "100";
            // Act
            var response1 = await client.GetAsync($"/Board/{id}");
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
            var response2 = await client.DeleteAsync($"/Board/{id}");
            // Assert
            response2.EnsureSuccessStatusCode();
        }
    }
}
