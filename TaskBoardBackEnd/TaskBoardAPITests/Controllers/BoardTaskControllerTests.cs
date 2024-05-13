using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoardAPI.Controllers;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Controllers
{
    [TestFixture]
    internal class BoardTaskControllerTests : BaseControlllerTests<BoardTaskController>
    {
        private Mock<IBoardTaskService> mockBoardTaskService;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            mockBoardTaskService = mockRepository.Create<IBoardTaskService>();
            mockBoardTaskService = CreateMockBoardTaskService();
        }
        private Mock<IBoardTaskService> CreateMockBoardTaskService()
        {
            var mockService = mockRepository.Create<IBoardTaskService>();
            mockService.Setup(x => x.GetTaskByIdAsync("validId", It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardTask { Id = "validResult" });
            mockService.Setup(x => x.GetTaskByIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            mockService.Setup(x => x.GetTasksByListIdAsync("validId", It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardTask> { new BoardTask { Id = "validId" } });
            mockService.Setup(x => x.GetTasksByListIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardTask>());
            mockService.Setup(x => x.CreateTaskAsync(It.IsNotNull<BoardTask>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardTask());
            mockService.Setup(x => x.CreateTaskAsync(It.Is<BoardTask>(x => x == null), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            return mockService;
        }
        protected override BoardTaskController CreateController()
        {
            return new BoardTaskController(
                mockBoardTaskService.Object,
                mockMapper.Object);
        }
        [Test]
        public async Task GetTaskById_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var boardTaskController = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.GetTaskById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardTaskDto>(okResult.Value);
            var boardTaskDto = okResult.Value as BoardTaskDto;
            Assert.That(boardTaskDto.Id, Is.EqualTo("validResult"));
            mockBoardTaskService.Verify(x => x.GetTaskByIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskById_InvalidId_NotFound()
        {
            // Arrange
            var boardTaskController = CreateController();
            string id = "invalidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.GetTaskById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
            mockBoardTaskService.Verify(x => x.GetTaskByIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTasksByListId_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var boardTaskController = CreateController();
            string listId = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.GetTasksByListId(
                listId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardTaskDto>>(okResult.Value);
            var boardTasksDto = okResult.Value as IEnumerable<BoardTaskDto>;
            Assert.That(boardTasksDto, Is.Not.Null);
            Assert.That(boardTasksDto.Count(), Is.EqualTo(1));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync(listId, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTasksByListId_InvalidId_OkWithEmptyList()
        {
            // Arrange
            var boardTaskController = CreateController();
            string listId = "invalidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.GetTasksByListId(
                listId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardTaskDto>>(okResult.Value);
            var boardTasksDto = okResult.Value as IEnumerable<BoardTaskDto>;
            Assert.That(boardTasksDto, Is.Not.Null);
            Assert.That(boardTasksDto.Count(), Is.EqualTo(0));
            mockBoardTaskService.Verify(x => x.GetTasksByListIdAsync(listId, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateTask_ValidData_OkStatusCodeWithNewAddedData()
        {
            // Arrange
            var boardTaskController = CreateController();
            BoardTaskDto boardTaskDto = new BoardTaskDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.CreateTask(
                boardTaskDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardTaskDto>(okResult.Value);
            var responceBoardTaskDto = okResult.Value as BoardTaskDto;
            Assert.That(responceBoardTaskDto, Is.Not.Null);
            Assert.That(responceBoardTaskDto, Is.Not.SameAs(boardTaskDto));
            mockBoardTaskService.Verify(x => x.CreateTaskAsync(It.IsAny<BoardTask>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateTask_NullData_OkStatusCodeWithNull()
        {
            // Arrange
            var boardTaskController = CreateController();
            BoardTaskDto boardTaskDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.CreateTask(
                boardTaskDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Null);
            mockBoardTaskService.Verify(x => x.CreateTaskAsync(It.IsAny<BoardTask>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task UpdateBoardTask_ValidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var boardTaskController = CreateController();
            int positionIndex = 0;
            BoardTaskDto boardTaskDto = new BoardTaskDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.UpdateBoardTask(
                positionIndex,
                boardTaskDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskService.Verify(x => x.UpdateTaskAsync(It.IsAny<BoardTask>(), positionIndex, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task UpdateBoardTask_InvalidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var boardTaskController = CreateController();
            int positionIndex = 0;
            BoardTaskDto boardTaskDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.UpdateBoardTask(
                positionIndex,
                boardTaskDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskService.Verify(x => x.UpdateTaskAsync(It.IsAny<BoardTask>(), positionIndex, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task DeleteBoardTask_ValidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var boardTaskController = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.DeleteBoardTask(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskService.Verify(x => x.DeleteTaskAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task DeleteBoardTask_InvalidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var boardTaskController = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskController.DeleteBoardTask(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskService.Verify(x => x.DeleteTaskAsync(id, cancellationToken), Times.Exactly(1));
        }
    }
}
