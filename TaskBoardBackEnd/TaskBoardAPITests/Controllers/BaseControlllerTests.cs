using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPITests.Controllers
{
    internal abstract class BaseControlllerTests<T> where T : ControllerBase
    {
        protected MockRepository mockRepository;
        protected Mock<IMapper> mockMapper;

        [SetUp]
        public virtual void SetUp()
        {
            this.mockRepository = new MockRepository(MockBehavior.Default);
            this.mockMapper = CreateMockMapper();
        }
        private Mock<IMapper> CreateMockMapper()
        {
            mockMapper = this.mockRepository.Create<IMapper>();
            mockMapper.Setup(x =>
            x.Map<BoardActivityDto>(It.IsAny<BoardActivity>()))
            .Returns<BoardActivity>((x) =>
            {
                return x == null ? null : new BoardActivityDto { Id = x.Id };
            });
            mockMapper.Setup(x =>
            x.Map<BoardActivity>(It.IsAny<BoardActivityDto>()))
            .Returns<BoardActivityDto>((x) =>
            {
                return x == null ? null : new BoardActivity { Id = x.Id };
            });

            mockMapper.Setup(x =>
            x.Map<BoardTaskActivityDto>(It.IsAny<BoardTaskActivity>()))
            .Returns<BoardTaskActivity>((x) =>
            {
                return x == null ? null : new BoardTaskActivityDto { Id = x.Id };
            });
            mockMapper.Setup(x =>
            x.Map<BoardTaskActivity>(It.IsAny<BoardTaskActivityDto>()))
            .Returns<BoardTaskActivityDto>((x) =>
            {
                return x == null ? null : new BoardTaskActivity { Id = x.Id };
            });

            mockMapper.Setup(x =>
            x.Map<BoardTaskDto>(It.IsAny<BoardTask>()))
            .Returns<BoardTask>((x) =>
            {
                return x == null ? null : new BoardTaskDto { Id = x.Id };
            });
            mockMapper.Setup(x =>
            x.Map<BoardTask>(It.IsAny<BoardTaskDto>()))
            .Returns<BoardTaskDto>((x) =>
            {
                return x == null ? null : new BoardTask { Id = x.Id };
            });

            mockMapper.Setup(x =>
            x.Map<BoardTaskListDto>(It.IsAny<BoardTaskList>()))
            .Returns<BoardTaskList>((x) =>
            {
                return x == null ? null : new BoardTaskListDto { Id = x.Id };
            });
            mockMapper.Setup(x =>
            x.Map<BoardTaskList>(It.IsAny<BoardTaskListDto>()))
            .Returns<BoardTaskListDto>((x) =>
            {
                return x == null ? null : new BoardTaskList { Id = x.Id };
            });

            mockMapper.Setup(x =>
            x.Map<UserDto>(It.IsAny<User>()))
            .Returns<User>((x) =>
            {
                return x == null ? null : new UserDto { Id = x.Id };
            });
            mockMapper.Setup(x =>
            x.Map<User>(It.IsAny<UserDto>()))
            .Returns<UserDto>((x) =>
            {
                return x == null ? null : new User { Id = x.Id };
            });
            return mockMapper;
        }
        protected abstract T CreateController();
    }
}
