using Microsoft.Extensions.DependencyInjection;
using TaskBoardAPI.Data;
using TaskBoardAPI.Models;

namespace TaskBoardIntegrationTests.Controllers
{
    [TestFixture]
    internal class BaseContollerTests
    {
        protected List<User> testUsers;
        protected List<Board> testBoards;
        protected List<BoardTaskList> testBoardTaskLists;
        protected List<BoardTask> testBoardTasks;
        protected List<BoardActivity> testBoardActivities;
        protected List<BoardTaskActivity> testBoardTaskActivities;
        protected TaskBoardWebApplicationFactory factory;
        protected HttpClient client;
        protected BoardTasksDbContext dbContext;
        private IServiceScope scope;

        [OneTimeSetUp]
        public void OneTimeSetUp()
        {
            factory = new TaskBoardWebApplicationFactory();
        }
        [SetUp]
        public void SetUp()
        {
            client = factory.CreateClient();
            scope = factory.Services.CreateScope();
            dbContext = scope.ServiceProvider.GetRequiredService<BoardTasksDbContext>();
            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();
            SeedDatabase(dbContext);
        }
        [TearDown]
        public void TearDown()
        {
            client?.Dispose();
            dbContext?.Dispose();
            scope?.Dispose();
        }
        [OneTimeTearDown]
        public void OneTimeTearDown()
        {
            factory?.Dispose();
        }
        private void SeedDatabase(BoardTasksDbContext dbContext)
        {
            dbContext.Users.AddRange(GetTestUsers());
            dbContext.Boards.AddRange(GetTestBoards());
            dbContext.BoardTaskLists.AddRange(GetTestTaskLists());
            dbContext.BoardTasks.AddRange(GetTestTasks());
            dbContext.BoardActivities.AddRange(GetTestActivities());
            dbContext.BoardTaskActivities.AddRange(GetTestTaskActivities());
            dbContext.SaveChanges();
        }
        private List<User> GetTestUsers()
        {
            return testUsers = new List<User>
            {
                new User { Id = "1" },
                new User { Id = "2" }
            };
        }
        private List<Board> GetTestBoards()
        {
            return testBoards = new List<Board>
            {
               new Board { Id = "1", UserId = "1", CreationTime = DateTime.MinValue, Name="Board1" },
               new Board { Id = "2", UserId = "2", CreationTime = DateTime.MaxValue, Name="Board2" }
            };
        }
        private List<BoardTaskList> GetTestTaskLists()
        {
            return testBoardTaskLists = new List<BoardTaskList>
            {
               new BoardTaskList { Id = "1", BoardId = "1", CreationTime = DateTime.MinValue, Name = "List1" },
               new BoardTaskList { Id = "2", BoardId = "1", CreationTime = DateTime.MinValue, Name = "List2" },
               new BoardTaskList { Id = "3", BoardId = "2", CreationTime = DateTime.MinValue, Name = "List3" }
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
        private List<BoardActivity> GetTestActivities()
        {
            return testBoardActivities = new List<BoardActivity>
            {
               new BoardActivity { Id = "1", BoardId = "1", ActivityTime = DateTime.MinValue, Description ="Activity1" },
               new BoardActivity { Id = "2", BoardId = "1", ActivityTime = DateTime.MinValue, Description ="Activity2" },
               new BoardActivity { Id = "3", BoardId = "1", ActivityTime = DateTime.MinValue, Description ="Activity3" }
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
    }
}
