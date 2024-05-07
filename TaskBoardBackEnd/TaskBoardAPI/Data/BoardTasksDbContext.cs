using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Models;
using BoardTask = TaskBoardAPI.Models.BoardTask;

namespace TaskBoardAPI.Data
{
    public class BoardTasksDbContext(DbContextOptions<BoardTasksDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<BoardTaskList> BoardTaskLists { get; set; }
        public DbSet<BoardTask> BoardTasks { get; set; }
        public DbSet<BoardTaskActivity> BoardTaskActivities { get; set; }
        public DbSet<BoardActivity> BoardActivities { get; set; }
    }
}
