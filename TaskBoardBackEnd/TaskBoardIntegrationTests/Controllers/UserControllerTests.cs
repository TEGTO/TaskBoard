using System.Net;
using TaskBoardAPI.Models;

namespace TaskBoardIntegrationTests.Controllers
{
    [TestFixture]
    internal class UserControllerTests : BaseContollerTests
    {
        [Test]
        public async Task GetUserById_ValidId_ValidData()
        {
            //Arrange
            string id = "1";
            var expectedTask = testUsers.Find(x => x.Id == id);
            // Act
            var response = await client.GetAsync($"/User/{id}");
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Contain(expectedTask.Id));
        }
        [Test]
        public async Task GetUserById_InvalidId_NotFound()
        {
            //Arrange
            string id = "100";
            // Act
            var response = await client.GetAsync($"/User/{id}");
            // Assert
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
        }
        [Test]
        public async Task CreateUser_ValidData_ValidCreatedData()
        {
            //Arrange
            User newUser = new User() { Id = "OldId" };
            int prevAmount = dbContext.Users.Count();
            // Act
            var response = await client.PostAsJsonAsync($"/User", newUser);
            // Assert
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.That(responseString, Does.Not.Contain(newUser.Id));
            int currentAmount = dbContext.Users.Count();
            Assert.True(currentAmount > prevAmount);
        }
        [Test]
        public async Task CreateUsers_InvalidData_ServerError()
        {
            //Arrange
            User newUser1 = null;
            User newUser2 = new User() { Id = null };
            int prevAmount = dbContext.Users.Count();
            // Act
            var response1 = await client.PostAsJsonAsync($"/User", newUser1);
            var response2 = await client.PostAsJsonAsync($"/User", newUser2);
            // Assert
            Assert.That(response1.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            Assert.That(response2.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
            int currentAmount = dbContext.Users.Count();
            Assert.True(currentAmount == prevAmount);
        }
    }
}
