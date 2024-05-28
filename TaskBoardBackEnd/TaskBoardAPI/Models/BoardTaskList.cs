using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskBoardAPI.Models
{
    public class BoardTaskList
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = null!;
        public string BoardId { get; set; } = null!;
        public DateTime CreationTime { get; set; }
        public string? Name { get; set; }
        public List<BoardTask> BoardTasks { get; set; } = new List<BoardTask>();

        public void CopyOther(BoardTaskList other)
        {
            BoardId = other.BoardId;
            Name = other.Name;
            CreationTime = other.CreationTime;
        }
    }
}
