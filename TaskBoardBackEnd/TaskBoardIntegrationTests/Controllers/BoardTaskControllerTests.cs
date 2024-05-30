using System.Net;
using System.Net.Http.Json;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardIntegrationTests.Controllers
{
    [TestFixture]
    internal class BoardTaskControllerTests : BaseContollerTests
    {
        [Test]
        public async Task GetTaskById_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedTask = testBoardTasks.Find(x => x.Id == id);
            // Act
            var response = await client.GetAsync($"/BoardTask/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain(expectedTask.Name));
        }
        [Test]
        public async Task GetTaskById_InvalidId_NotFound()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/BoardTask/{id}");
            // Assert
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task GetTasksByListId_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedTasks = testBoardTasks.Where(x => x.BoardTaskListId == id);
            // Act
            var response = await client.GetAsync($"/BoardTask/list/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            foreach (var task in expectedTasks)
            {
                Assert.That(responseString, Does.Contain(task.Name));
            }
        }
        [Test]
        public async Task GetTasksByListId_InvalidId_ValidEmptyData()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/BoardTask/list/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain("[]"));
        }
        [Test]
        public async Task CreateTask_ValidData_ValidCreatedData()
        {
            //Arrange
            BoardTask newBoardTask = new BoardTask() { Id = "OldId", BoardTaskListId = "1", Name = "NewBoardTask" };
            int prevAmount = dbContext.BoardTasks.Count();
            // Act
            var response = await client.PostAsJsonAsync($"/BoardTask", newBoardTask);
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Not.Contain(newBoardTask.Id));
            Assert.That(responseString, Does.Contain(newBoardTask.Name));
            int currentAmount = dbContext.BoardTasks.Count();
            Assert.True(currentAmount > prevAmount);
        }
        [Test]
        public async Task CreateTasks_InvalidData_ServerError()
        {
            //Arrange
            BoardTask newBoardTask1 = null;
            BoardTask newBoardTask2 = new BoardTask() { Id = "", BoardTaskListId = "notexists" };
            int prevAmount = dbContext.BoardTasks.Count();
            // Act
            var response1 = await client.PostAsJsonAsync($"/BoardTask", newBoardTask1);
            var response2 = await client.PostAsJsonAsync($"/BoardTask", newBoardTask2);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.InternalServerError));
            int currentAmount = dbContext.BoardTasks.Count();
            Assert.True(currentAmount == prevAmount);
        }
        [Test]
        public async Task UpdateTask_ValidData_OkStatusAndDataIsUpdated()
        {
            //Arrange
            BoardTask boardTask = new BoardTask() { Id = "1", BoardTaskListId = "3", Name = "NewName" };
            int positionIndex = 1;
            // Act
            var response = await client.PutAsJsonAsync($"/BoardTask?positionIndex={positionIndex}", boardTask);
            // Assert
            response.EnsureSuccessStatusCode();
            var response1 = await client.GetAsync($"/BoardTask/{boardTask.Id}");
            var responseString1 = await response1.Content.ReadAsStringAsync();
            Assert.That(responseString1, Does.Contain(boardTask.Id));
            Assert.That(responseString1, Does.Contain(boardTask.BoardTaskListId));
            Assert.That(responseString1, Does.Contain(boardTask.Name));
            var response2 = await client.GetAsync($"/BoardTask/list/{boardTask.BoardTaskListId}");
            var responseString2 = await response2.Content.ReadFromJsonAsync<List<BoardTaskDto>>();
            Assert.That(responseString2[1].Name, Is.EqualTo(boardTask.Name));
        }
        [Test]
        public async Task UpdateTasks_InvalidValidationData_BadRequestStatus()
        {
            //Arrange
            BoardTask badRequestBoardTask = new BoardTask() { Id = "1" };
            BoardTask nullBoardTask = null;
            // Act
            var response1 = await client.PutAsJsonAsync($"/BoardTask", badRequestBoardTask);
            var response2 = await client.PutAsJsonAsync($"/BoardTask", nullBoardTask);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
        }
        [Test]
        public async Task UpdateTask_InvalidData_OkStatusAndDataIsNotUpdated()
        {
            //Arrange
            BoardTask boardTask = new BoardTask() { Id = "100", BoardTaskListId = "3", Name = "NewName" };
            // Act
            var response1 = await client.PutAsJsonAsync($"/BoardTask", boardTask);
            // Assert
            response1.EnsureSuccessStatusCode();
            var response2 = await client.GetAsync($"/BoardTask/{boardTask.Id}");
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task DeleteTask_ValidData_OkStatusAndDataIsDeleted()
        {
            //Arrange
            string id = "1";
            // Act
            var response1 = await client.DeleteAsync($"/BoardTask/{id}");
            // Assert
            response1.EnsureSuccessStatusCode();
            var response2 = await client.GetAsync($"/BoardTask/{id}");
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task DeleteTask_InvalidData_OkStatusAndDataIsNotExisted()
        {
            //Arrange
            string id = "100";
            // Act
            var response1 = await client.GetAsync($"/BoardTask/{id}");
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
            var response2 = await client.DeleteAsync($"/BoardTask/{id}");
            // Assert
            response2.EnsureSuccessStatusCode();
        }
    }
}