using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoardAPI.Controllers;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Controllers
{
    [TestFixture]
    internal class UserControllerTests : BaseControlllerTests<UserController>
    {
        private Mock<IUserService> mockUserService;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            mockUserService = CreateMockUserService();
        }
        private Mock<IUserService> CreateMockUserService()
        {
            var mockService = mockRepository.Create<IUserService>();
            mockService.Setup(x => x.GetUserByIdAsync("validId", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new User { Id = "validResult" });
            mockService.Setup(x => x.GetUserByIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            mockService.Setup(x => x.CreateNewUserAsync(It.IsNotNull<User>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new User());
            mockService.Setup(x => x.CreateNewUserAsync(It.Is<User>(x => x == null), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            return mockService;
        }
        protected override UserController CreateController()
        {
            return new UserController(
                mockUserService.Object,
                mockMapper.Object);
        }
        [Test]
        public async Task GetUserById_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var userController = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await userController.GetUserById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<UserDto>(okResult.Value);
            var userDto = okResult.Value as UserDto;
            Assert.That(userDto.Id, Is.EqualTo("validResult"));
            mockUserService.Verify(x => x.GetUserByIdAsync(id,false, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetUserById_InvalidId_NotFound()
        {
            // Arrange
            var userController = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await userController.GetUserById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
            mockUserService.Verify(x => x.GetUserByIdAsync(id, false, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateUser_ValidData_OkStatusCodeWithNewAddedData()
        {
            // Arrange
            var userController = CreateController();
            UserDto userDto = new UserDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await userController.CreateUser(
                userDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<UserDto>(okResult.Value);
            var responceUserDto = okResult.Value as UserDto;
            Assert.That(responceUserDto, Is.Not.Null);
            Assert.That(responceUserDto, Is.Not.SameAs(userDto));
            mockUserService.Verify(x => x.CreateNewUserAsync(It.IsAny<User>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateUser_NullData_OkStatusCodeWithNull()
        {
            // Arrange
            var userController = CreateController();
            UserDto userDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await userController.CreateUser(
                userDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Null);
            mockUserService.Verify(x => x.CreateNewUserAsync(It.IsAny<User>(), cancellationToken), Times.Exactly(1));
        }
    }
}