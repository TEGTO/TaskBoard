using System.Net;
using System.Net.Http.Json;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardIntegrationTests.Controllers
{
    [TestFixture]
    internal class BoardTaskActivityControllerTests : BaseContollerTests
    {
        [Test]
        public async Task GetBoardTaskActivityById_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedActivity = testBoardTaskActivities.Find(x => x.Id == id);
            // Act
            var response = await client.GetAsync($"/BoardTaskActivity/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain(expectedActivity.Id));
            Assert.That(responseString, Does.Contain(expectedActivity.Description));
        }
        [Test]
        public async Task GetBoardTaskActivityById_InvalidId_NotFound()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/BoardTaskActivity/{id}");
            // Assert
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task GetBoardTaskActivitiesByTaskId_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            // Act
            var response = await client.GetAsync($"/BoardTaskActivity/taskActivities/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadFromJsonAsync<List<BoardTaskActivityDto>>();
            Assert.That(responseContent.Count(), Is.EqualTo(3));
            Assert.That(responseContent[0].Id, Is.EqualTo(testBoardTaskActivities[0].Id));
            Assert.That(responseContent[0].BoardTaskId, Is.EqualTo(testBoardTaskActivities[0].BoardTaskId));
            Assert.That(responseContent[0].Description, Is.EqualTo(testBoardTaskActivities[0].Description));
        }
        [Test]
        public async Task GetBoardTaskActivitiesByTaskId_InvalidId_ValidEmptyData()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/BoardTaskActivity/taskActivities/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadFromJsonAsync<List<BoardTaskActivityDto>>();
            Assert.That(responseContent.Count(), Is.EqualTo(0));
        }
        [Test]
        public async Task CreateBoardTaskActivity_ValidData_ValidCreatedData()
        {
            //Arrange
            BoardTaskActivity newActivity = new BoardTaskActivity() { Id = "OldId", BoardTaskId = "1", ActivityTime = DateTime.Now };
            int prevAmount = dbContext.BoardTaskActivities.Count();
            // Act
            var response = await client.PostAsJsonAsync($"/BoardTaskActivity", newActivity);
            // Assert
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadFromJsonAsync<BoardTaskActivityDto>();
            Assert.That(responseContent.Id, Is.Not.EqualTo(newActivity.Id));
            Assert.That(responseContent.BoardTaskId, Is.EqualTo(newActivity.BoardTaskId));
            int currentAmount = dbContext.BoardTaskActivities.Count();
            Assert.True(currentAmount > prevAmount);
        }
        [Test]
        public async Task CreateBoardTaskActivity_InvalidData_ServerError()
        {
            //Arrange
            BoardTaskActivity newActivity1 = null;
            BoardTaskActivity newActivity2 = new BoardTaskActivity() { Id = "", BoardTaskId = "notexists" };
            int prevAmount = dbContext.BoardTaskActivities.Count();
            // Act
            var response1 = await client.PostAsJsonAsync($"/BoardTaskActivity", newActivity1);
            var response2 = await client.PostAsJsonAsync($"/BoardTaskActivity", newActivity2);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.InternalServerError));
            int currentAmount = dbContext.BoardTaskActivities.Count();
            Assert.True(currentAmount == prevAmount);
        }
    }
}
