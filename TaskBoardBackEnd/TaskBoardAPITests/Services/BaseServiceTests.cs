using Microsoft.EntityFrameworkCore;
using MockQueryable.Moq;
using Moq;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;
using TaskBoardAPI.Services;

namespace TaskBoardAPITests.Services
{
    [TestFixture]
    internal abstract class BaseServiceTests<T> where T : ServiceDBBase
    {
        protected List<User> testUsers;
        protected List<BoardActivity> testBoardActivities;
        protected List<BoardTaskActivity> testBoardTaskActivities;
        protected List<BoardTaskList> testBoardTaskLists;
        protected List<BoardTask> testBoardTasks;

        protected MockRepository mockRepository;
        protected Mock<IDbContextFactory<BoardTasksDbContext>> mockDbContextFactory;
        protected Mock<BoardTasksDbContext> mockDbContext;

        [SetUp]
        public virtual void SetUp()
        {
            mockRepository = new MockRepository(MockBehavior.Default);
            mockDbContextFactory = mockRepository.Create<IDbContextFactory<BoardTasksDbContext>>();
            mockDbContext = CreateMockDbContext();
            mockDbContextFactory.Setup(m => m.CreateDbContextAsync(It.IsAny<CancellationToken>())).ReturnsAsync(mockDbContext.Object);
        }
        protected abstract T CreateService();
        private Mock<BoardTasksDbContext> CreateMockDbContext()
        {
            var options = new DbContextOptionsBuilder<BoardTasksDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var mockDbContext = mockRepository.Create<BoardTasksDbContext>(options);
            mockDbContext.Setup(m => m.Users).Returns(GetTestUserDbSet());
            mockDbContext.Setup(m => m.BoardActivities).Returns(GetTestBoardActivitiesDbSet());
            mockDbContext.Setup(m => m.BoardTaskActivities).Returns(GetTestTaskBoardActivitiesDbSet());
            mockDbContext.Setup(m => m.BoardTaskLists).Returns(GetTestTaskListsDbSet());
            mockDbContext.Setup(m => m.BoardTasks).Returns(GetTestTasksDbSet());
            mockDbContext.Setup(m => m.AddAsync(It.IsAny<BoardActivity>(), It.IsAny<CancellationToken>()))
                .Callback<BoardActivity, CancellationToken>((boardActivity, cancellationToken) =>
                {
                    if (testUsers.Exists(x => x.Id == boardActivity.UserId))
                        testBoardActivities.Add(boardActivity);
                    else
                        throw new InvalidDataException($"Entity with 'Id': '{boardActivity.UserId}' does not exist!");
                });
            mockDbContext.Setup(m => m.AddAsync(It.IsAny<BoardTaskActivity>(), It.IsAny<CancellationToken>()))
               .Callback<BoardTaskActivity, CancellationToken>((boardTaskActivity, cancellationToken) =>
               {
                   if (testBoardTasks.Exists(x => x.Id == boardTaskActivity.BoardTaskId))
                       testBoardTaskActivities.Add(boardTaskActivity);
                   else
                       throw new InvalidDataException($"Entity with 'Id': '{boardTaskActivity.BoardTaskId}' does not exist!");
               });
            mockDbContext.Setup(m => m.AddAsync(It.IsAny<BoardTaskList>(), It.IsAny<CancellationToken>()))
                .Callback<BoardTaskList, CancellationToken>((boardTaskList, cancellationToken) =>
                {
                    if (testUsers.Exists(x => x.Id == boardTaskList.UserId))
                        testBoardTaskLists.Add(boardTaskList);
                    else
                        throw new InvalidDataException($"Entity with 'Id': '{boardTaskList.UserId}' does not exist!");
                });
            mockDbContext.Setup(m => m.Remove(It.IsAny<BoardTaskList>()))
               .Callback<BoardTaskList>((boardTaskList) =>
               {
                   testBoardTaskLists.Remove(boardTaskList);
               });
            mockDbContext.Setup(m => m.AddAsync(It.IsAny<BoardTask>(), It.IsAny<CancellationToken>()))
            .Callback<BoardTask, CancellationToken>((boardTask, cancellationToken) =>
            {
                if (testBoardTaskLists.Exists(x => x.Id == boardTask.BoardTaskListId))
                    testBoardTasks.Add(boardTask);
                else
                    throw new InvalidDataException($"Entity with 'Id': '{boardTask.BoardTaskListId}' does not exist!");
            });
            mockDbContext.Setup(m => m.Remove(It.IsAny<BoardTask>()))
                .Callback<BoardTask>((boardTask) =>
            {
                testBoardTasks.Remove(boardTask);
            });
            mockDbContext.Setup(m => m.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
           .Callback<User, CancellationToken>((user, cancellationToken) =>
           {
               testUsers.Add(user);
           });
            return mockDbContext;
        }
        private DbSet<User> GetTestUserDbSet()
        {
            var mockSet = GetTestUsers().AsQueryable().BuildMockDbSet();
            return mockSet.Object;
        }
        private DbSet<BoardActivity> GetTestBoardActivitiesDbSet()
        {
            var mockSet = GetTestActivities().AsQueryable().BuildMockDbSet();
            return mockSet.Object;
        }
        private DbSet<BoardTaskActivity> GetTestTaskBoardActivitiesDbSet()
        {
            var mockSet = GetTestTaskActivities().AsQueryable().BuildMockDbSet();
            return mockSet.Object;
        }
        private DbSet<BoardTaskList> GetTestTaskListsDbSet()
        {
            var mockSet = GetTestTaskLists().AsQueryable().BuildMockDbSet();
            return mockSet.Object;
        }
        private DbSet<BoardTask> GetTestTasksDbSet()
        {
            var mockSet = GetTestTasks().AsQueryable().BuildMockDbSet();
            return mockSet.Object;
        }
        private List<User> GetTestUsers()
        {
            return testUsers = new List<User>
            {
               new User { Id = "1" },
               new User { Id = "2" },
            };
        }
        private List<BoardActivity> GetTestActivities()
        {
            return testBoardActivities = new List<BoardActivity>
            {
               new BoardActivity { Id = "1", UserId = "1", ActivityTime = DateTime.MinValue, Description ="Activity1" },
               new BoardActivity { Id = "2", UserId = "1", ActivityTime = DateTime.MinValue, Description ="Activity2" },
               new BoardActivity { Id = "3", UserId = "1", ActivityTime = DateTime.MinValue, Description ="Activity3" }
            };
        }
        private List<BoardTaskActivity> GetTestTaskActivities()
        {
            return testBoardTaskActivities = new List<BoardTaskActivity>
            {
               new BoardTaskActivity { Id = "1", BoardTaskId = "1", ActivityTime = DateTime.MinValue, Description ="Activity1" },
               new BoardTaskActivity { Id = "2", BoardTaskId = "1", ActivityTime = DateTime.MinValue, Description ="Activity2" },
               new BoardTaskActivity { Id = "3", BoardTaskId = "1", ActivityTime = DateTime.MinValue, Description ="Activity3" }
            };
        }
        private List<BoardTaskList> GetTestTaskLists()
        {
            return testBoardTaskLists = new List<BoardTaskList>
            {
               new BoardTaskList { Id ="1", UserId = "1", CreationTime = DateTime.MinValue, Name = "List1",
                   BoardTasks = new List<BoardTask>{ new BoardTask { Id = "1", BoardTaskListId = "1", CreationTime = DateTime.MinValue, Name = "Task1", DueTime = DateTime.MinValue, Description = "description", Priority = Priority.Low } } },
               new BoardTaskList { Id = "2", UserId = "1", CreationTime = DateTime.MinValue, Name = "List2",
                   BoardTasks = new List<BoardTask>{ new BoardTask { Id = "2", BoardTaskListId = "2", CreationTime = DateTime.MinValue, Name = "Task2", DueTime = DateTime.MinValue, Description = "description", Priority = Priority.Low } } },
               new BoardTaskList { Id = "3", UserId = "2", CreationTime = DateTime.MinValue, Name = "List3",
                   BoardTasks = new List<BoardTask>{ new BoardTask { Id = "3", BoardTaskListId = "3", CreationTime = DateTime.MinValue, Name = "Task3", DueTime = DateTime.MinValue, Description = "description", Priority = Priority.Low } } }
            };
        }
        private List<BoardTask> GetTestTasks()
        {
            return testBoardTasks = new List<BoardTask>
            {
                new BoardTask { Id = "1", BoardTaskListId = "1", CreationTime = DateTime.MinValue, Name = "Task1", DueTime = DateTime.MinValue, Description = "description", Priority = Priority.Low },
                new BoardTask { Id = "2", BoardTaskListId = "2", CreationTime = DateTime.MinValue, Name = "Task2", DueTime = DateTime.MinValue, Description = "description", Priority = Priority.Low },
                new BoardTask { Id = "3", BoardTaskListId = "3", CreationTime = DateTime.MinValue, Name = "Task3", DueTime = DateTime.MinValue, Description = "description", Priority = Priority.Low, NextTaskId = "4" },
                new BoardTask { Id = "4", BoardTaskListId = "3", CreationTime = DateTime.MinValue, Name = "Task4", DueTime = DateTime.MinValue, Description = "description", Priority = Priority.Low, PrevTaskId = "3"}
            };
        }
    }
}