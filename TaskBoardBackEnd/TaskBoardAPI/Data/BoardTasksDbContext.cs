using Microsoft.EntityFrameworkCore;
using TaskBoardAPI.Models;
using BoardTask = TaskBoardAPI.Models.BoardTask;

namespace TaskBoardAPI.Data
{
    public class BoardTasksDbContext(DbContextOptions<BoardTasksDbContext> options) : DbContext(options)
    {
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<BoardTaskList> BoardTaskLists { get; set; }
        public virtual DbSet<BoardTask> BoardTasks { get; set; }
        public virtual DbSet<BoardTaskActivity> BoardTaskActivities { get; set; }
        public virtual DbSet<BoardActivity> BoardActivities { get; set; }
    }
}
