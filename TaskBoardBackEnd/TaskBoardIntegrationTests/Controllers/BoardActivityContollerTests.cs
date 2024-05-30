using System.Net;
using System.Net.Http.Json;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardIntegrationTests.Controllers
{
    [TestFixture]
    internal class BoardActivityContollerTests : BaseContollerTests
    {
        [Test]
        public async Task GetBoardActivityById_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedActivity = testBoardActivities.Find(x => x.Id == id);
            // Act
            var response = await client.GetAsync($"/BoardActivity/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain(expectedActivity.Id));
            Assert.That(responseString, Does.Contain(expectedActivity.Description));
        }
        [Test]
        public async Task GetBoardActivityById_InvalidId_NotFound()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/BoardActivity/{id}");
            // Assert
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task GetBoardActivityAmount_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedAmount = 3;
            // Act
            var response = await client.GetAsync($"/BoardActivity/board/{id}/amount");
            // Assert
            response.EnsureSuccessStatusCode();
            var amount = int.Parse(await response.Content.ReadAsStringAsync());
            Assert.That(amount, Is.EqualTo(expectedAmount));
        }
        [Test]
        public async Task GetBoardActivityAmount_InvalidId_0Data()
        {
            //Arrange
            string id = "100";
            var expectedAmount = 0;
            // Act
            var response = await client.GetAsync($"/BoardActivity/board/{id}/amount");
            // Assert
            response.EnsureSuccessStatusCode();
            var amount = int.Parse(await response.Content.ReadAsStringAsync());
            Assert.That(amount, Is.EqualTo(expectedAmount));
        }
        [Test]
        public async Task GetBoardActivityOnPage_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            // Act
            var response = await client.GetAsync($"/BoardActivity/board/{id}/onpage?page=1&amountOnPage=1");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadFromJsonAsync<List<BoardActivityDto>>();
            Assert.That(responseContent.Count(), Is.EqualTo(1));
            Assert.That(responseContent[0].Id, Is.EqualTo(testBoardActivities[0].Id));
            Assert.That(responseContent[0].BoardId, Is.EqualTo(testBoardActivities[0].BoardId));
            Assert.That(responseContent[0].Description, Is.EqualTo(testBoardActivities[0].Description));
        }
        [Test]
        public async Task GetBoardActivityOnPage_InvalidId_ValidEmptyData()
        {
            //Arrange
            string id = "1";
            // Act
            var response = await client.GetAsync($"/BoardActivity/board/{id}/onpage?page=100&amountOnPage=1");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadFromJsonAsync<List<BoardActivityDto>>();
            Assert.That(responseContent.Count(), Is.EqualTo(0));
        }
        [Test]
        public async Task CreateBoardActivity_ValidData_ValidCreatedData()
        {
            //Arrange
            BoardActivity newActivity = new BoardActivity() { Id = "OldId", BoardId = "1", ActivityTime = DateTime.Now };
            int prevAmount = dbContext.BoardActivities.Count();
            // Act
            var response = await client.PostAsJsonAsync($"/BoardActivity", newActivity);
            // Assert
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadFromJsonAsync<BoardActivityDto>();
            Assert.That(responseContent.Id, Is.Not.EqualTo(newActivity.Id));
            Assert.That(responseContent.BoardId, Is.EqualTo(newActivity.BoardId));
            int currentAmount = dbContext.BoardActivities.Count();
            Assert.True(currentAmount > prevAmount);
        }
        [Test]
        public async Task CreateBoardActivity_InvalidData_ServerError()
        {
            //Arrange
            BoardActivity newActivity1 = null;
            BoardActivity newActivity2 = new BoardActivity() { Id = "", BoardId = "notexists" };
            int prevAmount = dbContext.BoardActivities.Count();
            // Act
            var response1 = await client.PostAsJsonAsync($"/BoardActivity", newActivity1);
            var response2 = await client.PostAsJsonAsync($"/BoardActivity", newActivity2);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.InternalServerError));
            int currentAmount = dbContext.BoardActivities.Count();
            Assert.True(currentAmount == prevAmount);
        }
    }
}
