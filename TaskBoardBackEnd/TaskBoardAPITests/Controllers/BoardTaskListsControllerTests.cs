﻿using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoardAPI.Controllers;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Controllers
{
    [TestFixture]
    internal class BoardTaskListsControllerTests : BaseControlllerTests<BoardTaskListController>
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
            mockService.Setup(x => x.GetTaskListsByBoardIdAsync("validId", It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardTaskList> { new BoardTaskList { Id = "validId" } });
            mockService.Setup(x => x.GetTaskListsByBoardIdAsync(It.Is<string>(x => x != "validId"), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new List<BoardTaskList>());
            mockService.Setup(x => x.CreateTaskListAsync(It.IsNotNull<BoardTaskList>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => new BoardTaskList());
            mockService.Setup(x => x.CreateTaskListAsync(It.Is<BoardTaskList>(x => x == null), It.IsAny<CancellationToken>()))
                .ReturnsAsync(() => null);
            return mockService;
        }
        protected override BoardTaskListController CreateController()
        {
            return new BoardTaskListController(
                mockBoardTaskListService.Object,
                mockMapper.Object);
        }

        [Test]
        public async Task GetTaskListsById_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var controller = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetTaskListById(
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
        public async Task GetTaskListsById_InvalidId_NotFound()
        {
            // Arrange
            var controller = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetTaskListById(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
            mockBoardTaskListService.Verify(x => x.GetTaskListByIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListByBoardId_ValidId_OkStatusCodeWithData()
        {
            // Arrange
            var controller = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetTaskListsByBoardId(
                id,
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
            mockBoardTaskListService.Verify(x => x.GetTaskListsByBoardIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task GetTaskListByBoardId_InvalidId_OkWithEmptyList()
        {
            // Arrange
            var controller = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.GetTaskListsByBoardId(
                id,
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
            mockBoardTaskListService.Verify(x => x.GetTaskListsByBoardIdAsync(id, cancellationToken), Times.Exactly(1));
        }
        [Test]
        public async Task CreateTaskList_ValidData_OkStatusCodeWithNewAddedData()
        {
            // Arrange
            var controller = CreateController();
            BoardTaskListDto boardTaskListDto = new BoardTaskListDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.CreateTaskList(
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
            var controller = CreateController();
            BoardTaskListDto boardTaskListDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.CreateTaskList(
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
            var controller = CreateController();
            BoardTaskListDto boardTaskListDto = new BoardTaskListDto();
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.UpdateTaskList(
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
            var controller = CreateController();
            BoardTaskListDto boardTaskListDto = null;
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.UpdateTaskList(
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
            var controller = CreateController();
            string id = "validId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.DeleteTaskList(
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
            var controller = CreateController();
            string id = "inValidId";
            CancellationToken cancellationToken = default(global::System.Threading.CancellationToken);
            // Act
            var result = await controller.DeleteTaskList(
                id,
                cancellationToken);
            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.IsInstanceOf<OkResult>(result);
            mockBoardTaskListService.Verify(x => x.DeleteTaskListAsync(id, cancellationToken), Times.Exactly(1));
        }
    }
}
