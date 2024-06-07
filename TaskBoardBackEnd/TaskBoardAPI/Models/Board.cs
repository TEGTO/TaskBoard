using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskBoardAPI.Models
{
    public class Board
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public DateTime CreationTime { get; set; }
        public string? Name { get; set; }
        public List<BoardTaskList> BoardTaskLists { get; set; } = new List<BoardTaskList>();
        public List<BoardActivity> BoardActivities { get; set; } = new List<BoardActivity>();

        public void CopyOther(Board other)
        {
            UserId = other.UserId;
            Name = other.Name;
            CreationTime = other.CreationTime;
        }
    }
}
