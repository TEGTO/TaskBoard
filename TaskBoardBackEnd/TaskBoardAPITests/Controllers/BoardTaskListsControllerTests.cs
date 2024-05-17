using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoardAPI.Controllers;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Controllers
{
    [TestFixture]
    internal class BoardTaskListsControllerTests : BaseControlllerTests<BoardTaskListsController>
    {
        private Mock<IBoardTaskListService> mockBoardTaskListService;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            mockBoardTaskListService = CreateMockBoardTaskListService();
        }
        private Mock<IBoardTaskListService> CreateMockBoardTaskListService()
        {
            var mockService = mockRepository.Create<IBoardTaskListService>();
            mockService.Setup(x => x.GetTaskListByIdAsync("validId", It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardTaskList { Id = "validResult" });
            mockService.Setup(x => x.GetTaskListByIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            mockService.Setup(x => x.GetTaskListsByUserIdAsync("validId", It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardTaskList> { new BoardTaskList { Id = "validId" } });
            mockService.Setup(x => x.GetTaskListsByUserIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardTaskList>());
            mockService.Setup(x => x.CreateTaskListAsync(It.IsNotNull<BoardTaskList>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardTaskList());
            mockService.Setup(x => x.CreateTaskListAsync(It.Is<BoardTaskList>(x => x == null), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            return mockService;
        }
        protected override BoardTaskListsController CreateController()
        {
            return new BoardTaskListsController(
                mockBoardTaskListService.Object,
                mockMapper.Object);
        }
        [Test]
        public async Task GetTaskListsByUserId_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.GetTaskListsByUserId(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardTaskListDto>(okResult.Value);
            var boardTaskListDto = okResult.Value as BoardTaskListDto;
            Assert.That(boardTaskListDto.Id, Is.EqualTo("validResult"));
            mockBoardTaskListService.Verify(x => x.GetTaskListByIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListsByUserId_InvalidId_NotFound()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.GetTaskListsByUserId(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
            mockBoardTaskListService.Verify(x => x.GetTaskListByIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListById_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            string userId = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.GetTaskListById(
                userId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardTaskListDto>>(okResult.Value);
            var boardTaskListsDto = okResult.Value as IEnumerable<BoardTaskListDto>;
            Assert.That(boardTaskListsDto, Is.Not.Null);
            Assert.That(boardTaskListsDto.Count(), Is.EqualTo(1));
            mockBoardTaskListService.Verify(x => x.GetTaskListsByUserIdAsync(userId, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListById_InvalidId_OkWithEmptyList()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            string userId = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.GetTaskListById(
                userId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardTaskListDto>>(okResult.Value);
            var boardTaskListsDto = okResult.Value as IEnumerable<BoardTaskListDto>;
            Assert.That(boardTaskListsDto, Is.Not.Null);
            Assert.That(boardTaskListsDto.Count(), Is.EqualTo(0));
            mockBoardTaskListService.Verify(x => x.GetTaskListsByUserIdAsync(userId, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateTaskList_ValidData_OkStatusCodeWithNewAddedData()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            BoardTaskListDto boardTaskListDto = new BoardTaskListDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.CreateTaskList(
                boardTaskListDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardTaskListDto>(okResult.Value);
            var responceBoardTaskListDto = okResult.Value as BoardTaskListDto;
            Assert.That(responceBoardTaskListDto, Is.Not.Null);
            Assert.That(responceBoardTaskListDto, Is.Not.SameAs(boardTaskListDto));
            mockBoardTaskListService.Verify(x => x.CreateTaskListAsync(It.IsAny<BoardTaskList>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateTaskList_NullData_OkStatusCodeWithNull()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            BoardTaskListDto boardTaskListDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.CreateTaskList(
                boardTaskListDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Null);
            mockBoardTaskListService.Verify(x => x.CreateTaskListAsync(It.IsAny<BoardTaskList>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task UpdateTaskList_ValidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            BoardTaskListDto boardTaskListDto = new BoardTaskListDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.UpdateTaskList(
                boardTaskListDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskListService.Verify(x => x.UpdateTaskListAsync(It.IsAny<BoardTaskList>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task UpdateTaskList_InvalidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            BoardTaskListDto boardTaskListDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.UpdateTaskList(
                boardTaskListDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskListService.Verify(x => x.UpdateTaskListAsync(It.IsAny<BoardTaskList>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task DeleteTaskList_ValidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.DeleteTaskList(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskListService.Verify(x => x.DeleteTaskListAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task DeleteTaskList_InvalidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var boardTaskListsController = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardTaskListsController.DeleteTaskList(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskListService.Verify(x => x.DeleteTaskListAsync(id, cancellationToken), Times.Exactly(1));
        }
    }
}
