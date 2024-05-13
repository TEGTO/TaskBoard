using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoardAPI.Controllers;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Controllers
{
    [TestFixture]
    internal class BoardTaskActivityControllerTests : BaseControlllerTests<BoardTaskActivityController>
    {
        private Mock<IBoardTaskActivityService> mockBoardTaskActivityService;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            this.mockBoardTaskActivityService = CreateMockBoardTaskActivityService();
        }
        private Mock<IBoardTaskActivityService> CreateMockBoardTaskActivityService()
        {
            var mockService = this.mockRepository.Create<IBoardTaskActivityService>();
            mockService.Setup(x => x.GetTaskActivityByIdAsync("validId", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardTaskActivity { Id = "validResult" });
            mockService.Setup(x => x.GetTaskActivityByIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            mockService.Setup(x => x.GetTaskActivitiesByTaskIdAsync("validId", It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardTaskActivity>());
            mockService.Setup(x => x.GetTaskActivitiesByTaskIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            mockService.Setup(x => x.CreateTaskBoardActivityAsync(It.IsNotNull<BoardTaskActivity>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardTaskActivity());
            mockService.Setup(x => x.CreateTaskBoardActivityAsync(It.Is<BoardTaskActivity>(x => x == null), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            return mockService;
        }
        protected override BoardTaskActivityController CreateController()
        {
            return new BoardTaskActivityController(
              this.mockBoardTaskActivityService.Object,
              this.mockMapper.Object);
        }
        [Test]
        public async Task GetBoardTaskActivityById_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var boardTaskActivityController = this.CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskActivityController.GetBoardTaskActivityById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardTaskActivityDto>(okResult.Value);
            var boardActivityDto = okResult.Value as BoardTaskActivityDto;
            Assert.That(boardActivityDto.Id, Is.EqualTo("validResult"));
            mockBoardTaskActivityService.Verify(x => x.GetTaskActivityByIdAsync(id, false, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardTaskActivityById_InvalidId_NotFound()
        {
            // Arrange
            var boardTaskActivityController = this.CreateController();
            string id = "invalidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskActivityController.GetBoardTaskActivityById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
            mockBoardTaskActivityService.Verify(x => x.GetTaskActivityByIdAsync(id, false, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardTaskActivitiesByTaskId_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var boardTaskActivityController = this.CreateController();
            string taskId = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskActivityController.GetBoardTaskActivitiesByTaskId(
                taskId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardTaskActivityDto>>(okResult.Value);
            var boardTaskActivityDto = okResult.Value as IEnumerable<BoardTaskActivityDto>;
            Assert.That(boardTaskActivityDto, Is.Not.Null);
            mockBoardTaskActivityService.Verify(x => x.GetTaskActivitiesByTaskIdAsync(taskId,
                cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardTaskActivitiesByTaskId_InvalidId_NotFound()
        {
            // Arrange
            var boardTaskActivityController = this.CreateController();
            string taskId = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskActivityController.GetBoardTaskActivitiesByTaskId(
                taskId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
            mockBoardTaskActivityService.Verify(x => x.GetTaskActivitiesByTaskIdAsync(taskId,
                cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateBoardTaskActivity_ValidData_OkStatusCodeWithNewAddedData()
        {
            // Arrange
            var boardTaskActivityController = this.CreateController();
            BoardTaskActivityDto boardTaskActivityDto = new BoardTaskActivityDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskActivityController.CreateBoardTaskActivity(
                boardTaskActivityDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardTaskActivityDto>(okResult.Value);
            var boardTaskActivityDtoResponce = okResult.Value as BoardTaskActivityDto;
            Assert.That(boardTaskActivityDtoResponce, Is.Not.Null);
            Assert.That(boardTaskActivityDtoResponce, Is.Not.SameAs(boardTaskActivityDto));
            mockBoardTaskActivityService.Verify(x => x.CreateTaskBoardActivityAsync(It.IsAny<BoardTaskActivity>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateBoardTaskActivity_NullData_OkStatusCodeWithNull()
        {
            // Arrange
            var boardTaskActivityController = this.CreateController();
            BoardTaskActivityDto boardTaskActivityDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskActivityController.CreateBoardTaskActivity(
                boardTaskActivityDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Null);
            mockBoardTaskActivityService.Verify(x => x.CreateTaskBoardActivityAsync(It.IsAny<BoardTaskActivity>(), cancellationToken), Times.Exactly(1));
        }
    }
}
