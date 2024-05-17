using AutoMapper;
using TaskBoardAPI;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPITests
{
    [TestFixture]
    public class AutoMapperProfileTests
    {
        private IMapper mapper;

        [SetUp]
        public void Setup()
        {
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            mapper = configuration.CreateMapper();
        }
        [Test]
        public void UserToUserDto_ValidData_ValidResult()
        {
            // Arrange
            var user = new User { Id = "1", BoardTaskLists = new List<BoardTaskList>() };
            // Act
            var userDto = mapper.Map<UserDto>(user);
            // Assert
            Assert.That(userDto.Id, Is.EqualTo(user.Id));
        }
        [Test]
        public void UserToUserDto_NullData_NullResult()
        {
            // Arrange
            User user = null;
            // Act 
            var userDto = mapper.Map<UserDto>(user);
            // Assert
            Assert.That(userDto, Is.Null);
        }
        [Test]
        public void UserDtoToUser_ValidData_ValidResult()
        {
            // Arrange
            var userDto = new UserDto { Id = "1" };
            // Act
            var user = mapper.Map<User>(userDto);
            // Assert
            Assert.That(user.Id, Is.EqualTo(userDto.Id));
            Assert.That(user.BoardTaskLists.Count(), Is.EqualTo(0));
        }
        [Test]
        public void UserDtoToUser_NullData_NullResult()
        {
            // Arrange
            UserDto userDto = null;
            // Act
            var user = mapper.Map<User>(userDto);
            //Assert
            Assert.That(user, Is.Null);
        }
        [Test]
        public void BoardTaskListToBoardTaskListDto_ValidData_ValidResult()
        {
            // Arrange
            var boardTaskList = new BoardTaskList
            {
                Id = "1",
                UserId = "2",
                CreationTime = DateTime.Now,
                Name = "Task List",
                BoardTasks = new List<BoardTask>()
            };
            // Act
            var boardTaskListDto = mapper.Map<BoardTaskListDto>(boardTaskList);
            // Assert
            Assert.That(boardTaskListDto.Id, Is.EqualTo(boardTaskList.Id));
            Assert.That(boardTaskListDto.UserId, Is.EqualTo(boardTaskList.UserId));
            Assert.That(boardTaskListDto.CreationTime, Is.EqualTo(boardTaskList.CreationTime));
            Assert.That(boardTaskListDto.Name, Is.EqualTo(boardTaskList.Name));
            Assert.That(boardTaskListDto.BoardTasks.Count, Is.EqualTo(boardTaskList.BoardTasks.Count));
        }
        [Test]
        public void BoardTaskListToBoardTaskListDto_NullData_NullResult()
        {
            // Arrange
            BoardTaskList boardTaskList = null;
            // Act
            var boardTaskListDto = mapper.Map<BoardTaskListDto>(boardTaskList);
            // Assert
            Assert.That(boardTaskListDto, Is.Null);
        }
        [Test]
        public void BoardTaskListDtoToBoardTaskList_ValidData_ValidResult()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto
            {
                Id = "1",
                UserId = "2",
                CreationTime = DateTime.Now,
                Name = "Task List",
                BoardTasks = new List<BoardTaskDto>()
            };
            // Act
            var boardTaskList = mapper.Map<BoardTaskList>(boardTaskListDto);
            // Assert
            Assert.That(boardTaskList.Id, Is.EqualTo(boardTaskListDto.Id));
            Assert.That(boardTaskList.UserId, Is.EqualTo(boardTaskListDto.UserId));
            Assert.That(boardTaskList.CreationTime, Is.EqualTo(boardTaskListDto.CreationTime));
            Assert.That(boardTaskList.Name, Is.EqualTo(boardTaskListDto.Name));
            Assert.That(boardTaskList.BoardTasks.Count, Is.EqualTo(boardTaskListDto.BoardTasks.Count));
        }
        [Test]
        public void BoardTaskListDtoToBoardTaskList_NullData_NullResult()
        {
            // Arrange
            BoardTaskListDto boardTaskListDto = null;
            // Act
            var boardTaskList = mapper.Map<BoardTaskList>(boardTaskListDto);
            // Assert
            Assert.That(boardTaskList, Is.Null);
        }
        [Test]
        public void BoardTaskToBoardTaskDto_ValidData_ValidResult()
        {
            // Arrange
            var boardTask = new BoardTask
            {
                Id = "1",
                BoardTaskListId = "2",
                CreationTime = DateTime.Now,
                DueTime = DateTime.Now.AddDays(7),
                Name = "Task Name",
                Description = "Task Description",
                Priority = Priority.High
            };
            // Act
            var boardTaskDto = mapper.Map<BoardTaskDto>(boardTask);
            // Assert
            Assert.That(boardTaskDto.Id, Is.EqualTo(boardTask.Id));
            Assert.That(boardTaskDto.BoardTaskListId, Is.EqualTo(boardTask.BoardTaskListId));
            Assert.That(boardTaskDto.CreationTime, Is.EqualTo(boardTask.CreationTime));
            Assert.That(boardTaskDto.DueTime, Is.EqualTo(boardTask.DueTime));
            Assert.That(boardTaskDto.Name, Is.EqualTo(boardTask.Name));
            Assert.That(boardTaskDto.Description, Is.EqualTo(boardTask.Description));
            Assert.That(boardTaskDto.Priority, Is.EqualTo(boardTask.Priority));
        }
        [Test]
        public void BoardTaskToBoardTaskDto_NulldData_NullResult()
        {
            // Arrange
            BoardTask boardTask = null;
            // Act
            var boardTaskDto = mapper.Map<BoardTaskDto>(boardTask);
            // Assert
            Assert.That(boardTaskDto, Is.Null);
        }
        [Test]
        public void BoardTaskDtoToBoardTask_ValidData_ValidResult()
        {
            // Arrange
            var boardTaskDto = new BoardTaskDto
            {
                Id = "1",
                BoardTaskListId = "2",
                CreationTime = DateTime.Now,
                DueTime = DateTime.Now.AddDays(7),
                Name = "Task Name",
                Description = "Task Description",
                Priority = Priority.High
            };
            // Act
            var boardTask = mapper.Map<BoardTask>(boardTaskDto);
            // Assert
            Assert.That(boardTask.Id, Is.EqualTo(boardTaskDto.Id));
            Assert.That(boardTask.BoardTaskListId, Is.EqualTo(boardTaskDto.BoardTaskListId));
            Assert.That(boardTask.CreationTime, Is.EqualTo(boardTaskDto.CreationTime));
            Assert.That(boardTask.DueTime, Is.EqualTo(boardTaskDto.DueTime));
            Assert.That(boardTask.Name, Is.EqualTo(boardTaskDto.Name));
            Assert.That(boardTask.Description, Is.EqualTo(boardTaskDto.Description));
            Assert.That(boardTask.Priority, Is.EqualTo(boardTaskDto.Priority));
            Assert.That(boardTask.PrevTaskId, Is.EqualTo(default));
            Assert.That(boardTask.NextTaskId, Is.EqualTo(default));
        }
        [Test]
        public void BoardTaskDtoToBoardTask_NullData_NullResult()
        {
            // Arrange
            BoardTaskDto boardTaskDto = null;
            // Act
            var boardTask = mapper.Map<BoardTask>(boardTaskDto);
            // Assert
            Assert.That(boardTask, Is.Null);
        }
        [Test]
        public void BoardTaskActivityToBoardTaskActivityDto_ValidData_ValidResult()
        {
            // Arrange
            var boardTaskActivity = new BoardTaskActivity
            {
                Id = "1",
                BoardTaskId = "2",
                ActivityTime = DateTime.Now,
                Description = "Activity Description"
            };
            // Act
            var boardTaskActivityDto = mapper.Map<BoardTaskActivityDto>(boardTaskActivity);
            // Assert
            Assert.That(boardTaskActivityDto.Id, Is.EqualTo(boardTaskActivity.Id));
            Assert.That(boardTaskActivityDto.BoardTaskId, Is.EqualTo(boardTaskActivity.BoardTaskId));
            Assert.That(boardTaskActivityDto.ActivityTime, Is.EqualTo(boardTaskActivity.ActivityTime));
            Assert.That(boardTaskActivityDto.Description, Is.EqualTo(boardTaskActivity.Description));
        }
        [Test]
        public void BoardTaskActivityToBoardTaskActivityDto_NullData_NullResult()
        {
            // Arrange
            BoardTaskActivity boardTaskActivity = null;
            // Act
            var boardTaskActivityDto = mapper.Map<BoardTaskActivityDto>(boardTaskActivity);
            // Assert
            Assert.That(boardTaskActivityDto, Is.Null);
        }
        [Test]
        public void BoardTaskActivityDtoToBoardTaskActivity_ValidData_ValidResult()
        {
            // Arrange
            var boardTaskActivityDto = new BoardTaskActivityDto
            {
                Id = "1",
                BoardTaskId = "2",
                ActivityTime = DateTime.Now,
                Description = "Activity Description"
            };
            // Act
            var boardTaskActivity = mapper.Map<BoardTaskActivity>(boardTaskActivityDto);
            // Assert
            Assert.That(boardTaskActivity.Id, Is.EqualTo(boardTaskActivityDto.Id));
            Assert.That(boardTaskActivity.BoardTaskId, Is.EqualTo(boardTaskActivityDto.BoardTaskId));
            Assert.That(boardTaskActivity.ActivityTime, Is.EqualTo(boardTaskActivityDto.ActivityTime));
            Assert.That(boardTaskActivity.Description, Is.EqualTo(boardTaskActivityDto.Description));
        }
        [Test]
        public void BoardTaskActivityDtoToBoardTaskActivity_NulldData_NullResult()
        {
            // Arrange
            BoardTaskActivityDto boardTaskActivityDto = null;
            // Act
            var boardTaskActivity = mapper.Map<BoardTaskActivity>(boardTaskActivityDto);
            // Assert
            Assert.That(boardTaskActivity, Is.Null);
        }
        [Test]
        public void BoardActivityToBoardActivityDto_ValidData_ValidResult()
        {
            // Arrange
            var boardActivity = new BoardActivity
            {
                Id = "1",
                UserId = "2",
                ActivityTime = DateTime.Now,
                Description = "Activity Description"
            };
            // Act
            var boardActivityDto = mapper.Map<BoardActivityDto>(boardActivity);
            // Assert
            Assert.That(boardActivityDto.Id, Is.EqualTo(boardActivity.Id));
            Assert.That(boardActivityDto.UserId, Is.EqualTo(boardActivity.UserId));
            Assert.That(boardActivityDto.ActivityTime, Is.EqualTo(boardActivity.ActivityTime));
            Assert.That(boardActivityDto.Description, Is.EqualTo(boardActivity.Description));
        }
        [Test]
        public void BoardActivityToBoardActivityDto_NulldData_NullResult()
        {
            // Arrange
            BoardActivity boardActivity = null;
            // Act
            var boardActivityDto = mapper.Map<BoardActivityDto>(boardActivity);
            // Assert
            Assert.That(boardActivityDto, Is.Null);
        }
        [Test]
        public void BoardActivityDtoToBoardActivity_ValidData_ValidResult()
        {
            // Arrange
            var boardActivityDto = new BoardActivityDto
            {
                Id = "1",
                UserId = "2",
                ActivityTime = DateTime.Now,
                Description = "Activity Description"
            };
            // Act
            var boardActivity = mapper.Map<BoardActivity>(boardActivityDto);
            // Assert
            Assert.That(boardActivity.Id, Is.EqualTo(boardActivityDto.Id));
            Assert.That(boardActivity.UserId, Is.EqualTo(boardActivityDto.UserId));
            Assert.That(boardActivity.ActivityTime, Is.EqualTo(boardActivityDto.ActivityTime));
            Assert.That(boardActivity.Description, Is.EqualTo(boardActivityDto.Description));
        }
        [Test]
        public void BoardActivityDtoToBoardActivity_NulldData_NullResult()
        {
            // Arrange
            BoardActivityDto boardActivityDto = null;
            // Act
            var boardActivity = mapper.Map<BoardActivity>(boardActivityDto);
            // Assert
            Assert.That(boardActivity, Is.Null);
        }
    }
}
