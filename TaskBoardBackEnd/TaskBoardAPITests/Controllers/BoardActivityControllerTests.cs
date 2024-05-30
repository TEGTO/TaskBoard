using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoardAPI.Controllers;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Controllers
{
    [TestFixture]
    internal class BoardActivityControllerTests : BaseControlllerTests<BoardActivityController>
    {
        private Mock<IBoardActivityService> mockBoardActivityService;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            mockBoardActivityService = CreateMockBoardActivityService();
        }
        private Mock<IBoardActivityService> CreateMockBoardActivityService()
        {
            var mockService = mockRepository.Create<IBoardActivityService>();
            mockService.Setup(x => x.GetActivityByIdAsync("validId", It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardActivity { Id = "validResult" });
            mockService.Setup(x => x.GetActivityByIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<bool>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            mockService.Setup(x => x.GetActivitiesOnPageByBoardIdAsync("validId", It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardActivity>());
            mockService.Setup(x => x.GetActivitiesOnPageByBoardIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardActivity>());
            mockService.Setup(x => x.CreateBoardActivityAsync(It.IsNotNull<BoardActivity>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardActivity());
            mockService.Setup(x => x.CreateBoardActivityAsync(It.Is<BoardActivity>(x => x == null), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            return mockService;
        }
        protected override BoardActivityController CreateController()
        {
            return new BoardActivityController(
                mockBoardActivityService.Object,
                mockMapper.Object);
        }
        [Test]
        public async Task GetBoardActivityById_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var boardActivityController = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardActivityController.GetBoardActivityById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardActivityDto>(okResult.Value);
            var boardActivityDto = okResult.Value as BoardActivityDto;
            Assert.That(boardActivityDto.Id, Is.EqualTo("validResult"));
            mockBoardActivityService.Verify(x => x.GetActivityByIdAsync(id, false, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardActivityById_InvalidId_NotFound()
        {
            // Arrange
            var boardActivityController = CreateController();
            string id = "invalidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardActivityController.GetBoardActivityById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
            mockBoardActivityService.Verify(x => x.GetActivityByIdAsync(id, false, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardActivityAmount_AnyUserId_ExpectedCountOfActivititiesByUser()
        {
            // Arrange
            var boardActivityController = CreateController();
            string boardId = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardActivityController.GetBoardActivityAmount(
                boardId,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.InstanceOf<int>());
            var value = (int)okResult.Value;
            Assert.That(value, Is.EqualTo(0));
            mockBoardActivityService.Verify(x => x.GetBoardActivityAmountByBoardIdAsync(boardId, cancellationToken), Times.Exactly(1));
        }

        [Test]
        public async Task GetBoardActivityOnPage_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var boardActivityController = CreateController();
            string boardId = "validId";
            int page = 0;
            int amountOnPage = 0;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardActivityController.GetBoardActivityOnPage(
                boardId,
                page,
                amountOnPage,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardActivityDto>>(okResult.Value);
            var boardActivityDto = okResult.Value as IEnumerable<BoardActivityDto>;
            Assert.That(boardActivityDto, Is.Not.Null);
            mockBoardActivityService.Verify(x => x.GetActivitiesOnPageByBoardIdAsync(boardId,
                page, amountOnPage, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardActivityOnPage_InvalidId_OkStatusCodeEmptyList()
        {
            // Arrange
            var boardActivityController = CreateController();
            string boardId = "invalidId";
            int page = 0;
            int amountOnPage = 0;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardActivityController.GetBoardActivityOnPage(
                boardId,
                page,
                amountOnPage,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardActivityDto>>(okResult.Value);
            var boardActivityDto = okResult.Value as IEnumerable<BoardActivityDto>;
            Assert.That(boardActivityDto, Is.Not.Null);
            mockBoardActivityService.Verify(x => x.GetActivitiesOnPageByBoardIdAsync(boardId,
                page, amountOnPage, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateBoardActivity_ValidData_OkStatusCodeWithNewAddedData()
        {
            // Arrange
            var boardActivityController = CreateController();
            BoardActivityDto boardActivityDto = new BoardActivityDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardActivityController.CreateBoardActivity(
                boardActivityDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardActivityDto>(okResult.Value);
            var boardActivityDtoResponce = okResult.Value as BoardActivityDto;
            Assert.That(boardActivityDtoResponce, Is.Not.Null);
            Assert.That(boardActivityDtoResponce, Is.Not.SameAs(boardActivityDto));
            mockBoardActivityService.Verify(x => x.CreateBoardActivityAsync(It.IsAny<BoardActivity>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateBoardActivity_NullData_OkStatusCodeWithNull()
        {
            // Arrange
            var boardActivityController = CreateController();
            BoardActivityDto boardActivityDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await boardActivityController.CreateBoardActivity(
                boardActivityDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Null);
            mockBoardActivityService.Verify(x => x.CreateBoardActivityAsync(It.IsAny<BoardActivity>(), cancellationToken), Times.Exactly(1));
        }
    }
}
