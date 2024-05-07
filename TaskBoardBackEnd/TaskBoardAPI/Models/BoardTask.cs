using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskBoardAPI.Models
{
    public enum Priority
    {
        Low,
        Medium,
        High
    }

    public class BoardTask
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = null!;
        public string BoardTaskListId { get; set; } = null!;
        public DateTime CreationTime { get; set; }
        public DateTime? DueTime { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public Priority Priority { get; set; }
        public string? PrevTaskId { get; set; }
        public bool IsHead { get; set; }
        public string? NextTaskId { get; set; }

        public void CopyOther(BoardTask other)
        {
            BoardTaskListId = other.BoardTaskListId;
            CreationTime = other.CreationTime;
            DueTime = other.DueTime;
            Name = other.Name;
            Description = other.Description;
            Priority = other.Priority;
        }
    }
}