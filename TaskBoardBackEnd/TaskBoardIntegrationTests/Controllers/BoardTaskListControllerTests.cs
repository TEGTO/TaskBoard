using System.Net;
using System.Net.Http.Json;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardIntegrationTests.Controllers
{
    [TestFixture]
    internal class BoardTaskListControllerTests : BaseContollerTests
    {
        [Test]
        public async Task GetTaskListById_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedTaskList = testBoardTaskLists.Find(x => x.Id == id);
            // Act
            var response = await client.GetAsync($"/BoardTaskList/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain(expectedTaskList.Name));
        }
        [Test]
        public async Task GetTaskListById_InvalidId_NotFound()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/BoardTaskList/{id}");
            // Assert
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task GetTaskListsByBoardId_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedTaskLists = testBoardTaskLists.Where(x => x.BoardId == id);
            // Act
            var response = await client.GetAsync($"/BoardTaskList/board/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            foreach (var taskList in expectedTaskLists)
            {
                Assert.That(responseString, Does.Contain(taskList.Name));
            }
        }
        [Test]
        public async Task GetTasksByListId_InvalidId_ValidEmptyData()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/BoardTaskList/board/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain("[]"));
        }
        [Test]
        public async Task CreateTaskList_ValidData_ValidCreatedData()
        {
            //Arrange
            BoardTaskList newTaskList = new BoardTaskList() { Id = "OldId", BoardId = "1", Name = "NewBoardTaskList" };
            int prevAmount = dbContext.BoardTaskLists.Count();
            // Act
            var response = await client.PostAsJsonAsync($"/BoardTaskList", newTaskList);
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Not.Contain(newTaskList.Id));
            Assert.That(responseString, Does.Contain(newTaskList.Name));
            int currentAmount = dbContext.BoardTaskLists.Count();
            Assert.True(currentAmount > prevAmount);
        }
        [Test]
        public async Task CreateTaskLists_InvalidData_ServerError()
        {
            //Arrange
            BoardTaskList newBoardTaskList1 = null;
            BoardTaskList newBoardTaskList2 = new BoardTaskList() { Id = "", BoardId = "notexists" };
            int prevAmount = dbContext.BoardTaskLists.Count();
            // Act
            var response1 = await client.PostAsJsonAsync($"/BoardTaskList", newBoardTaskList1);
            var response2 = await client.PostAsJsonAsync($"/BoardTaskList", newBoardTaskList2);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.InternalServerError));
            int currentAmount = dbContext.BoardTaskLists.Count();
            Assert.True(currentAmount == prevAmount);
        }
        [Test]
        public async Task UpdateTaskList_ValidData_OkStatusAndDataIsUpdated()
        {
            //Arrange
            BoardTaskList boardTaskList = new BoardTaskList() { Id = "1", BoardId = "2", Name = "NewName" };
            // Act
            var response = await client.PutAsJsonAsync($"/BoardTaskList", boardTaskList);
            // Assert
            response.EnsureSuccessStatusCode();
            var response1 = await client.GetAsync($"/BoardTaskList/{boardTaskList.Id}");
            var responseString1 = await response1.Content.ReadAsStringAsync();
            Assert.That(responseString1, Does.Contain(boardTaskList.Id));
            Assert.That(responseString1, Does.Contain(boardTaskList.BoardId));
            Assert.That(responseString1, Does.Contain(boardTaskList.Name));
            var response2 = await client.GetAsync($"/BoardTaskList/board/{boardTaskList.BoardId}");
            var responseString2 = await response2.Content.ReadFromJsonAsync<List<BoardTaskListDto>>();
            Assert.That(responseString2[0].Name, Is.EqualTo(boardTaskList.Name));
        }
        [Test]
        public async Task UpdateTaskLists_InvalidValidationData_BadRequestStatus()
        {
            //Arrange
            BoardTaskList badRequestList = new BoardTaskList() { Id = "1" };
            BoardTaskList nullList = null;
            // Act
            var response1 = await client.PutAsJsonAsync($"/BoardTaskList", badRequestList);
            var response2 = await client.PutAsJsonAsync($"/BoardTaskList", nullList);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
        }
        [Test]
        public async Task DeleteTaskList_ValidData_OkStatusAndDataIsDeleted()
        {
            //Arrange
            string id = "1";
            // Act
            var response1 = await client.DeleteAsync($"/BoardTaskList/{id}");
            // Assert
            response1.EnsureSuccessStatusCode();
            var response2 = await client.GetAsync($"/BoardTaskList/{id}");
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task DeleteTask_InvalidData_OkStatusAndDataIsNotExisted()
        {
            //Arrange
            string id = "100";
            // Act
            var response1 = await client.GetAsync($"/BoardTaskList/{id}");
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
            var response2 = await client.DeleteAsync($"/BoardTaskList/{id}");
            // Assert
            response2.EnsureSuccessStatusCode();
        }
    }
}
