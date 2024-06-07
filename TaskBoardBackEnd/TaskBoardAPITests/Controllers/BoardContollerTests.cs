using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoardAPI.Controllers;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Controllers
{
    [TestFixture]
    internal class BoardContollerTests : BaseControlllerTests<BoardController>
    {
        private Mock<IBoardService> mockBoardService;

        [SetUp]
        public override void SetUp()
        {
            base.SetUp();
            mockBoardService = CreateMockBoardTaskListService();
        }
        private Mock<IBoardService> CreateMockBoardTaskListService()
        {
            var mockService = mockRepository.Create<IBoardService>();
            mockService.Setup(x => x.GetBoardByIdAsync("validId", It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new Board { Id = "validResult" });
            mockService.Setup(x => x.GetBoardByIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            mockService.Setup(x => x.GetBoardsByUserIdAsync("validId", It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<Board> { new Board { Id = "validId" } });
            mockService.Setup(x => x.GetBoardsByUserIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<Board>());
            mockService.Setup(x => x.CreateBoardAsync(It.IsNotNull<Board>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new Board());
            mockService.Setup(x => x.CreateBoardAsync(It.Is<Board>(x => x == null), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            return mockService;
        }
        protected override BoardController CreateController()
        {
            return new BoardController(
              mockBoardService.Object,
              mockMapper.Object);
        }

        [Test]
        public async Task GetBoardById_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var controller = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetBoardById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardDto>(okResult.Value);
            var boardDto = okResult.Value as BoardDto;
            Assert.That(boardDto.Id, Is.EqualTo("validResult"));
            mockBoardService.Verify(x => x.GetBoardByIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardById_InvalidId_NotFound()
        {
            // Arrange
            var controller = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetBoardById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
            mockBoardService.Verify(x => x.GetBoardByIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardByUserId_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var controller = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetBoardsByUserId(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardDto>>(okResult.Value);
            var boardsDto = okResult.Value as IEnumerable<BoardDto>;
            Assert.That(boardsDto, Is.Not.Null);
            Assert.That(boardsDto.Count(), Is.EqualTo(1));
            mockBoardService.Verify(x => x.GetBoardsByUserIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetBoardByUserId_InvalidId_OkWithEmptyList()
        {
            // Arrange
            var controller = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetBoardsByUserId(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<IEnumerable<BoardDto>>(okResult.Value);
            var boardsDto = okResult.Value as IEnumerable<BoardDto>;
            Assert.That(boardsDto, Is.Not.Null);
            Assert.That(boardsDto.Count(), Is.EqualTo(0));
            mockBoardService.Verify(x => x.GetBoardsByUserIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListsAmountByBoardId_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var controller = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetBoardTaskListsAmountByBoardId(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<int>(okResult.Value);
            var amount = (int)okResult.Value;
            Assert.That(amount, Is.EqualTo(0));
            mockBoardService.Verify(x => x.GetTaskListsAmountAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListsAmountByBoardId_InvalidId_OkStatusCodeWithData()
        {
            // Arrange
            var controller = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetBoardTaskListsAmountByBoardId(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<int>(okResult.Value);
            var amount = (int)okResult.Value;
            Assert.That(amount, Is.EqualTo(0));
            mockBoardService.Verify(x => x.GetTaskListsAmountAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTasksAmountByBoardId_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var controller = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetBoardTasksAmountByBoardId(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<int>(okResult.Value);
            var amount = (int)okResult.Value;
            Assert.That(amount, Is.EqualTo(0));
            mockBoardService.Verify(x => x.GetTasksAmountAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTasksAmountByBoardId_InvalidId_OkStatusCodeWithData()
        {
            // Arrange
            var controller = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetBoardTasksAmountByBoardId(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<int>(okResult.Value);
            var amount = (int)okResult.Value;
            Assert.That(amount, Is.EqualTo(0));
            mockBoardService.Verify(x => x.GetTasksAmountAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateBoard_ValidData_OkStatusCodeWithNewAddedData()
        {
            // Arrange
            var controller = CreateController();
            BoardDto boardDto = new BoardDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.CreateBoard(
                boardDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Not.Null);
            Assert.IsInstanceOf<BoardDto>(okResult.Value);
            var responceBoardDto = okResult.Value as BoardDto;
            Assert.That(responceBoardDto, Is.Not.Null);
            Assert.That(responceBoardDto, Is.Not.SameAs(boardDto));
            mockBoardService.Verify(x => x.CreateBoardAsync(It.IsAny<Board>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateBoard_NullData_OkStatusCodeWithNull()
        {
            // Arrange
            var controller = CreateController();
            BoardDto boardDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.CreateBoard(
                boardDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.Null);
            mockBoardService.Verify(x => x.CreateBoardAsync(It.IsAny<Board>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task UpdateBoard_ValidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var controller = CreateController();
            BoardDto boardDto = new BoardDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.UpdateBoard(
                boardDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardService.Verify(x => x.UpdateBoardAsync(It.IsAny<Board>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task UpdateBoard_InvalidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var controller = CreateController();
            BoardDto boardDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.UpdateBoard(
                boardDto,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardService.Verify(x => x.UpdateBoardAsync(It.IsAny<Board>(), cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task DeleteBoard_ValidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var controller = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.DeleteBoard(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardService.Verify(x => x.DeleteBoardAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task DeleteBoard_InvalidDate_OkStatusCodeWithoutData()
        {
            // Arrange
            var controller = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.DeleteBoard(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardService.Verify(x => x.DeleteBoardAsync(id, cancellationToken), Times.Exactly(1));
        }
    }
}
